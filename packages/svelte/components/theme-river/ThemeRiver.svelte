<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface ThemeRiverProps extends HTMLAttributes<HTMLDivElement> {
    /** `[time, value, series]` tuples. Time can be a date string or number. */
    data: [string | number, number, string][]
    height?: number | string
    option?: any
    /** Accessible name announced for the chart image. Defaults to "Chart". */
    ariaLabel?: string
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { init, use, type ECharts } from 'echarts/core'
  import { CanvasRenderer } from 'echarts/renderers'
  import { ThemeRiverChart } from 'echarts/charts'
  import { LegendComponent, SingleAxisComponent, TooltipComponent } from 'echarts/components'
  import { untrack } from 'svelte'
  import { cn } from '$lib/utils'
  import { ChartTheme, mergeOptionBlock } from './useChartTheme.svelte'

  use([CanvasRenderer, ThemeRiverChart, SingleAxisComponent, TooltipComponent, LegendComponent])

  let {
    data,
    height = 320,
    option,
    class: className,
    ariaLabel,
    ref = $bindable(null),
    ...restProps
  }: ThemeRiverProps = $props()

  const theme = new ChartTheme()

  const mergedOption = $derived.by(() => {
    const series = [
      {
        type: 'themeRiver',
        data,
        label: { show: false },
        emphasis: { itemStyle: { shadowBlur: 12, shadowColor: 'rgba(0,0,0,0.2)' } },
      },
    ]

    const userOption: any = option ?? {}
    const {
      series: userSeries,
      singleAxis: userSingleAxis,
      tooltip: userTooltip,
      legend: userLegend,
      ...userRest
    } = userOption
    const mergedSeries = Array.isArray(userSeries)
      ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) }))
      : series

    return {
      color: theme.colors,
      tooltip: mergeOptionBlock(
        {
          trigger: 'axis',
          axisPointer: { type: 'line', lineStyle: { color: theme.axisColor, opacity: 0.8 } },
          backgroundColor: theme.tooltipBg,
          borderColor: theme.tooltipBorder,
          textStyle: { color: theme.tooltipText, fontSize: 12 },
        },
        userTooltip,
      ),
      legend:
        userLegend?.show === false
          ? undefined
          : mergeOptionBlock(
              {
                bottom: 0,
                icon: 'circle',
                itemWidth: 8,
                itemHeight: 8,
                textStyle: { fontSize: 11, color: theme.textColor },
              },
              userLegend,
            ),
      singleAxis: mergeOptionBlock(
        {
          top: 12,
          bottom: 40,
          type: 'time',
          axisTick: { show: false },
          axisLabel: { color: theme.textColor, fontSize: 11 },
          axisLine: { lineStyle: { color: theme.axisColor } },
        },
        userSingleAxis,
      ),
      series: mergedSeries,
      ...userRest,
    }
  })

  const heightStyle = $derived(/^\d+$/.test(String(height)) ? `${height}px` : String(height))

  let chartEl: HTMLDivElement | null = $state(null)
  let chart: ECharts | null = null

  $effect(() => {
    if (!chartEl) return
    chart = init(chartEl)
    const instance = chart
    const ro = new ResizeObserver(() => instance.resize())
    ro.observe(chartEl)
    // Apply the current option without subscribing — the update effect below owns that.
    untrack(() => {
      instance.setOption(mergedOption)
    })
    return () => {
      ro.disconnect()
      instance.dispose()
      if (chart === instance) chart = null
    }
  })

  $effect(() => {
    const opt = mergedOption
    untrack(() => {
      chart?.setOption(opt)
    })
  })
</script>

<div
  bind:this={ref}
  role="img"
  aria-label={ariaLabel || 'Chart'}
  data-uipkge=""
  data-slot="theme-river"
  style:height={heightStyle}
  class={cn('w-full', className)}
  {...restProps}
>
  <div bind:this={chartEl} class="size-full"></div>
</div>
