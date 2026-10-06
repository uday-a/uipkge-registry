<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface StackedAreaChartProps extends HTMLAttributes<HTMLDivElement> {
    data: Record<string, any>[]
    xField?: string
    yFields: string[]
    /** Render as 100% shares instead of absolute values. Default false. */
    percent?: boolean
    height?: number | string
    option?: any
    /** Accessible name announced for the chart image. Defaults to "Chart". */
    ariaLabel?: string
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { LineChart as EChartsLineChart } from 'echarts/charts'
  import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components'
  import { init, use, type ECharts } from 'echarts/core'
  import { CanvasRenderer } from 'echarts/renderers'
  import { cn } from '$lib/utils'
  import {
    chartAxisColor,
    chartColors,
    chartSplitLineColor,
    chartTextColor,
    chartTooltipBg,
    chartTooltipBorder,
    chartTooltipText,
    mergeOptionBlock,
    toRgba,
  } from './useChartTheme'

  use([CanvasRenderer, EChartsLineChart, GridComponent, TooltipComponent, LegendComponent])

  let {
    class: className,
    data,
    xField = 'x',
    yFields,
    percent = false,
    height = 320,
    option,
    ariaLabel,
    children,
    ref = $bindable(null),
    ...restProps
  }: StackedAreaChartProps = $props()

  const mergedOption = $derived.by(() => {
    const totals = data.map((d) => yFields.reduce((s, f) => s + (d[f] ?? 0), 0) || 1)
    const series = yFields.map((f, i) => {
      const c = $chartColors[i % $chartColors.length]
      return {
        name: f,
        type: 'line',
        stack: 'area',
        smooth: true,
        symbol: 'none',
        lineStyle: { width: 1.5, color: c },
        areaStyle: { color: toRgba(c, 0.45) },
        emphasis: { focus: 'series' },
        data: data.map((d, r) => (percent ? ((d[f] ?? 0) / totals[r]!) * 100 : d[f])),
      }
    })
    const userOption: any = option ?? {}
    const {
      series: userSeries,
      xAxis: userXAxis,
      yAxis: userYAxis,
      grid: userGrid,
      tooltip: userTooltip,
      legend: userLegend,
      ...userRest
    } = userOption
    const mergedSeries = Array.isArray(userSeries) ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) })) : series
    return {
      color: $chartColors,
      grid: mergeOptionBlock({ left: 16, right: 16, top: 24, bottom: 32, containLabel: true }, userGrid),
      tooltip: mergeOptionBlock(
        {
          trigger: 'axis',
          backgroundColor: $chartTooltipBg,
          borderColor: $chartTooltipBorder,
          textStyle: { color: $chartTooltipText, fontSize: 12 },
          valueFormatter: (v: any) => (percent ? `${(+v).toFixed(1)}%` : v),
        },
        userTooltip,
      ),
      legend: mergeOptionBlock(
        {
          bottom: 0,
          icon: 'circle',
          itemWidth: 8,
          itemHeight: 8,
          textStyle: { fontSize: 11, color: $chartTextColor },
        },
        userLegend,
      ),
      xAxis: mergeOptionBlock(
        {
          type: 'category',
          boundaryGap: false,
          data: data.map((d) => d[xField]),
          axisLine: { lineStyle: { color: $chartAxisColor } },
          axisLabel: { color: $chartTextColor, fontSize: 11 },
          axisTick: { show: false },
        },
        userXAxis,
      ),
      yAxis: mergeOptionBlock(
        percent
          ? {
              type: 'value',
              max: 100,
              splitLine: { lineStyle: { color: $chartSplitLineColor } },
              axisLabel: { color: $chartTextColor, fontSize: 11, formatter: '{value}%' },
            }
          : {
              type: 'value',
              splitLine: { lineStyle: { color: $chartSplitLineColor } },
              axisLabel: { color: $chartTextColor, fontSize: 11 },
            },
        userYAxis,
      ),
      series: mergedSeries,
      ...userRest,
    }
  })

  let container = $state<HTMLDivElement | null>(null)
  let chart = $state<ECharts | null>(null)
  let rootEl = $state<HTMLDivElement | null>(null)

  $effect(() => {
    ref = rootEl
  })

  $effect(() => {
    const el = container
    if (!el) return
    const instance = init(el)
    chart = instance
    const ro = new ResizeObserver(() => instance.resize())
    ro.observe(el)
    return () => {
      ro.disconnect()
      instance.dispose()
      if (chart === instance) chart = null
    }
  })

  $effect(() => {
    chart?.setOption(mergedOption, { notMerge: true })
  })

  const heightStyle = $derived(/^\d+$/.test(String(height)) ? `${height}px` : String(height))
</script>

<!-- Focusable chart region with an accessible name (mirrors the Vue twin). -->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
  bind:this={rootEl}
  role="img"
  tabindex="0"
  aria-label={ariaLabel || 'Chart'}
  style="height: {heightStyle}"
  data-uipkge=""
  data-slot="stacked-area-chart"
  class={cn('focus-visible:ring-ring w-full focus-visible:ring-2 focus-visible:outline-none', className)}
  {...restProps}
>
  <div bind:this={container} class="size-full"></div>
  {@render children?.()}
</div>
