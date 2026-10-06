<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface SparklineProps extends HTMLAttributes<HTMLDivElement> {
    data: number[]
    color?: string
    height?: number | string
    option?: any
    /** Accessible name announced for the chart image. Defaults to "Chart". */
    ariaLabel?: string
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { LineChart as EChartsLineChart, BarChart as EChartsBarChart } from 'echarts/charts'
  import { GridComponent, TooltipComponent } from 'echarts/components'
  import { use, init, type ECharts } from 'echarts/core'
  import { CanvasRenderer } from 'echarts/renderers'
  import { cn } from '$lib/utils'
  import { getChartColors, subscribeTheme, toRgba } from './useChartTheme'

  // Bar + grid + tooltip registered alongside line so consumers can swap
  // `type: 'bar'` via the option escape hatch (bar / win-loss sparklines)
  // without having to `use()`-register the extras in their own code.
  use([CanvasRenderer, EChartsLineChart, EChartsBarChart, GridComponent, TooltipComponent])

  let {
    class: className,
    data,
    color: colorProp,
    height = 40,
    option,
    ariaLabel,
    ref = $bindable(null),
    ...restProps
  }: SparklineProps = $props()

  let container: HTMLDivElement | null = $state(null)
  let chart: ECharts | null = $state(null)
  // Bumped by the theme subscription so the option re-resolves CSS tokens on dark/light flips.
  let themeKey = $state(0)

  $effect(() => {
    ref = container
  })

  $effect(() => {
    if (!container || typeof window === 'undefined') return
    const instance = init(container)
    chart = instance
    const ro = new ResizeObserver(() => instance.resize())
    ro.observe(container)
    const unsubscribe = subscribeTheme(() => {
      themeKey += 1
    })
    return () => {
      unsubscribe()
      ro.disconnect()
      instance.dispose()
      chart = null
    }
  })

  const mergedOption = $derived.by(() => {
    themeKey
    const color = colorProp ?? getChartColors()[1]
    const series = [
      {
        type: 'line',
        smooth: true,
        // Show a dot only at the last datapoint so the eye can find the
        // current value; intermediate dots clutter at sparkline density.
        showSymbol: false,
        showAllSymbol: false,
        symbol: 'circle',
        symbolSize: 5,
        endLabel: { show: false },
        lineStyle: { width: 1.75, color },
        itemStyle: { color, borderColor: color, borderWidth: 0 },
        // Render a small dot only at the latest point. ECharts' index-based
        // emphasis isn't exposed cleanly here, so we let `markPoint` handle
        // it -- a 4px dot pinned at the rightmost x using "max" on the time
        // axis would mark the peak, but we want the *last* point, so use
        // an explicit data point coord.
        data: data.map((v, i) => ({
          value: v,
          symbol: i === data.length - 1 ? 'circle' : 'none',
          symbolSize: i === data.length - 1 ? 5 : 0,
        })),
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: toRgba(color!, 0.18) },
              { offset: 1, color: toRgba(color!, 0) },
            ],
          },
        },
      },
    ]

    // Per-index series merge — partial overrides keep computed `type`/`data`.
    // Sparkline gets bar / win-loss variants this way (override `type: 'bar'`,
    // pass new data, the rest stays).
    const userOption: any = option ?? {}
    const { series: userSeries, ...userRest } = userOption
    const mergedSeries = Array.isArray(userSeries) ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) })) : series

    return {
      grid: { left: 0, right: 0, top: 2, bottom: 2 },
      xAxis: { type: 'category', show: false, data: data.map((_, i) => i) },
      yAxis: { type: 'value', show: false, min: (value: any) => value.min * 0.9 },
      tooltip: { show: false },
      series: mergedSeries,
      ...userRest,
    }
  })

  $effect(() => {
    if (chart) chart.setOption(mergedOption, { notMerge: true })
  })

  const heightStyle = $derived(/^\d+$/.test(String(height)) ? `${height}px` : String(height))
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -- focusable chart mirrors the Vue twin (keyboard focus ring on the chart image). -->
<div
  bind:this={container}
  role="img"
  tabindex="0"
  aria-label={ariaLabel || 'Chart'}
  style="height:{heightStyle}"
  class={cn('focus-visible:ring-ring w-full focus-visible:ring-2 focus-visible:outline-none', className)}
  {...restProps}
>
</div>
