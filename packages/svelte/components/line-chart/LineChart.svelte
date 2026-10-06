<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface LineChartProps extends HTMLAttributes<HTMLDivElement> {
    data: Record<string, any>[]
    xField?: string
    yField?: string | string[]
    /** Line interpolation. Default 'smooth'. */
    curve?: 'smooth' | 'linear' | 'step' | 'stepStart' | 'stepEnd'
    /** Stack series cumulatively. Default false. */
    stacked?: boolean
    /** Show point markers. Default true. */
    markers?: boolean
    /** Dashed stroke on all series (forecast look). Default false. */
    dashed?: boolean
    height?: number | string
    option?: any
    /** Accessible name announced for the chart image. Defaults to "Chart". */
    ariaLabel?: string
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { use, init, type ECharts } from 'echarts/core'
  import { CanvasRenderer } from 'echarts/renderers'
  import { LineChart as EChartsLineChart } from 'echarts/charts'
  import {
    GridComponent,
    TooltipComponent,
    LegendComponent,
    MarkPointComponent,
    MarkLineComponent,
    MarkAreaComponent,
  } from 'echarts/components'
  import { cn } from '$lib/utils'
  import { useChartTheme, mergeOptionBlock } from './useChartTheme.svelte'

  use([
    CanvasRenderer,
    EChartsLineChart,
    GridComponent,
    TooltipComponent,
    LegendComponent,
    MarkPointComponent,
    MarkLineComponent,
    MarkAreaComponent,
  ])

  let {
    data,
    xField = 'x',
    yField = 'y',
    curve = 'smooth',
    stacked = false,
    markers = true,
    dashed = false,
    height = 300,
    option,
    ariaLabel,
    class: className,
    ref = $bindable(null),
    ...restProps
  }: LineChartProps = $props()

  const mergedOption: any = $derived.by(() => {
    const theme = useChartTheme()
    const fields = Array.isArray(yField) ? yField : [yField]
    const xData = data.map((d) => d[xField])

    const series = fields.map((field, i) => ({
      name: field,
      type: 'line',
      smooth: curve === 'smooth',
      step:
        curve === 'step'
          ? 'middle'
          : curve === 'stepStart'
            ? 'start'
            : curve === 'stepEnd'
              ? 'end'
              : false,
      stack: stacked ? 'lines' : undefined,
      symbol: markers ? 'circle' : 'none',
      symbolSize: 6,
      lineStyle: { width: 2, type: dashed ? 'dashed' : 'solid' },
      itemStyle: { color: theme.colors[i % theme.colors.length] },
      data: data.map((d) => d[field]),
    }))

    // Per-index series merge + 2-level deep merge for axis blocks.
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
    const mergedSeries = Array.isArray(userSeries)
      ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) }))
      : series

    const baseLegend =
      fields.length > 1
        ? {
            bottom: 0,
            icon: 'circle',
            itemWidth: 8,
            itemHeight: 8,
            textStyle: { fontSize: 11, color: theme.textColor },
          }
        : undefined

    return {
      color: theme.colors,
      grid: mergeOptionBlock(
        { left: 16, right: 16, top: 24, bottom: fields.length > 1 ? 32 : 24, containLabel: true },
        userGrid,
      ),
      tooltip: mergeOptionBlock(
        {
          trigger: 'axis',
          backgroundColor: theme.tooltipBg,
          borderColor: theme.tooltipBorder,
          textStyle: { color: theme.tooltipText, fontSize: 12 },
        },
        userTooltip,
      ),
      legend: userLegend?.show === false ? undefined : mergeOptionBlock(baseLegend ?? {}, userLegend),
      xAxis: mergeOptionBlock(
        {
          type: 'category',
          data: xData,
          axisLine: { lineStyle: { color: theme.axisColor } },
          axisLabel: { color: theme.textColor, fontSize: 11 },
          axisTick: { show: false },
        },
        userXAxis,
      ),
      yAxis: mergeOptionBlock(
        {
          type: 'value',
          splitLine: { lineStyle: { color: theme.splitLineColor } },
          axisLabel: { color: theme.textColor, fontSize: 11 },
          axisLine: { show: false },
          axisTick: { show: false },
        },
        userYAxis,
      ),
      series: mergedSeries,
      ...userRest,
    }
  })

  let chartEl = $state<HTMLDivElement | null>(null)
  let chart: ECharts | null = null

  $effect(() => {
    const el = chartEl
    if (!el) return
    chart = init(el)
    const ro = new ResizeObserver(() => chart?.resize())
    ro.observe(el)
    return () => {
      ro.disconnect()
      chart?.dispose()
      chart = null
    }
  })

  $effect(() => {
    chart?.setOption(mergedOption, { notMerge: true, lazyUpdate: true })
  })
</script>

<!-- Focusable chart image mirrors the Vue/React twins for keyboard users. -->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
  bind:this={ref}
  data-uipkge=""
  data-slot="line-chart"
  role="img"
  tabindex="0"
  aria-label={ariaLabel || 'Chart'}
  style:height={/^\d+$/.test(String(height)) ? `${height}px` : String(height)}
  class={cn('focus-visible:ring-ring w-full focus-visible:ring-2 focus-visible:outline-none', className)}
  {...restProps}
>
  <div bind:this={chartEl} class="size-full"></div>
</div>
