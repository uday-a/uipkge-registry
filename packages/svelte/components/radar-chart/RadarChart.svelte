<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface RadarChartProps extends HTMLAttributes<HTMLDivElement> {
    indicators: { name: string; max: number }[]
    data: { name: string; value: number[] }[]
    height?: number | string
    option?: any
    /** Accessible name announced for the chart image. Defaults to "Chart". */
    ariaLabel?: string
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { init, use } from 'echarts/core'
  import { CanvasRenderer } from 'echarts/renderers'
  import { RadarChart as EChartsRadarChart } from 'echarts/charts'
  import { LegendComponent, RadarComponent, TooltipComponent } from 'echarts/components'
  import { cn } from '$lib/utils'
  import { resolveChartTheme, watchThemeVersion } from './useChartTheme'

  use([CanvasRenderer, EChartsRadarChart, RadarComponent, TooltipComponent, LegendComponent])

  let {
    class: className,
    indicators,
    data,
    height = 300,
    option,
    ariaLabel,
    ref = $bindable(null),
    ...restProps
  }: RadarChartProps = $props()

  let canvas: HTMLDivElement | null = null
  let chart = $state<ReturnType<typeof init> | null>(null)
  let themeVersion = $state(0)

  $effect(() => watchThemeVersion(() => (themeVersion += 1)))

  const theme = $derived.by(() => {
    themeVersion
    return resolveChartTheme()
  })

  const mergedOption = $derived.by(() => {
    const series = [
      {
        type: 'radar',
        data: data.map((d, i) => ({
          ...d,
          itemStyle: { color: theme.colors[i % theme.colors.length] },
          areaStyle: { opacity: 0.15 },
          lineStyle: { width: 2 },
        })),
      },
    ]

    // Per-index series merge — partial overrides keep computed `type`/`data`.
    const userOption: any = option ?? {}
    const { series: userSeries, ...userRest } = userOption
    const mergedSeries = Array.isArray(userSeries)
      ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) }))
      : series

    return {
      color: theme.colors,
      tooltip: {
        trigger: 'item',
        backgroundColor: theme.tooltipBg,
        borderColor: theme.tooltipBorder,
        textStyle: { color: theme.tooltipText, fontSize: 12 },
      },
      legend: {
        bottom: 0,
        icon: 'circle',
        itemWidth: 8,
        itemHeight: 8,
        textStyle: { fontSize: 11 },
      },
      radar: {
        indicator: indicators,
        radius: '60%',
        center: ['50%', '45%'],
        axisName: { fontSize: 11 },
        splitArea: { areaStyle: { color: ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.02)'] } },
      },
      series: mergedSeries,
      ...userRest,
    }
  })

  $effect(() => {
    if (!canvas) return
    const instance = init(canvas)
    chart = instance
    const ro = new ResizeObserver(() => instance.resize())
    ro.observe(canvas)
    return () => {
      ro.disconnect()
      instance.dispose()
      if (chart === instance) chart = null
    }
  })

  $effect(() => {
    chart?.setOption(mergedOption, { notMerge: true, lazyUpdate: true })
  })

  const heightStyle = $derived(/^\d+$/.test(String(height)) ? `${height}px` : String(height))
</script>

<!-- tabindex on a role="img" frame mirrors the Vue twin: keyboard users can focus the chart region. -->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
  bind:this={ref}
  role="img"
  tabindex="0"
  aria-label={ariaLabel || 'Chart'}
  data-uipkge=""
  data-slot="radar-chart"
  style="height: {heightStyle}"
  class={cn('focus-visible:ring-ring w-full focus-visible:ring-2 focus-visible:outline-none', className)}
  {...restProps}
>
  <div bind:this={canvas} class="size-full"></div>
</div>
