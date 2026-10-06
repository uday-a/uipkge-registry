<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface StackedBarChartProps extends HTMLAttributes<HTMLDivElement> {
    data: Record<string, any>[]
    xField?: string
    yFields: string[]
    /** Render as 100% shares instead of absolute values. Default false. */
    percent?: boolean
    /** Corner rounding in px. Default 6. */
    radius?: number
    /** Gap in px between stacked bar segments. Default 1. Set to 0 to disable. */
    stackGap?: number
    /** Color of the gap between stacked bar segments. Defaults to card background. */
    stackGapColor?: string
    height?: number | string
    option?: any
    /** Accessible name announced for the chart image. Defaults to "Chart". */
    ariaLabel?: string
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { BarChart as EChartsBarChart } from 'echarts/charts'
  import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components'
  import { init, use, type ECharts } from 'echarts/core'
  import { CanvasRenderer } from 'echarts/renderers'
  import { cn } from '$lib/utils'
  import {
    chartAxisColor,
    chartBgColor,
    chartColors,
    chartSplitLineColor,
    chartTextColor,
    chartTooltipBg,
    chartTooltipBorder,
    chartTooltipText,
    mergeOptionBlock,
  } from './useChartTheme'

  use([CanvasRenderer, EChartsBarChart, GridComponent, TooltipComponent, LegendComponent])

  let {
    class: className,
    data,
    xField = 'x',
    yFields,
    percent = false,
    radius = 6,
    stackGap = 1,
    stackGapColor,
    height = 320,
    option,
    ariaLabel,
    children,
    ref = $bindable(null),
    ...restProps
  }: StackedBarChartProps = $props()

  const mergedOption = $derived.by(() => {
    const totals = data.map((d) => yFields.reduce((s, f) => s + Math.abs(d[f] ?? 0), 0) || 1)
    const series = yFields.map((f, i) => ({
      name: f,
      type: 'bar',
      stack: 'total',
      barMaxWidth: 34,
      itemStyle: {
        color: $chartColors[i % $chartColors.length],
        borderRadius: [radius, radius, radius, radius],
        ...(stackGap > 0
          ? {
              borderColor: stackGapColor ?? $chartBgColor,
              borderWidth: stackGap,
            }
          : {}),
      },
      label: percent ? { show: true, color: '#fff', fontSize: 10, formatter: (p: any) => `${Math.round(p.value)}%` } : undefined,
      data: data.map((d, r) => (percent ? (Math.abs(d[f] ?? 0) / totals[r]!) * 100 : d[f])),
    }))
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

    const count = Math.max(yFields.length, Array.isArray(userSeries) ? userSeries.length : 0)
    const gap = stackGap
    const gapColor = stackGapColor ?? $chartBgColor

    const mergedSeries = Array.isArray(userSeries)
      ? Array.from({ length: count }, (_, i) => {
          const s = series[i] ?? {
            name: `series-${i}`,
            type: 'bar',
            stack: 'total',
            barMaxWidth: 34,
            itemStyle: {
              color: $chartColors[i % $chartColors.length],
            },
          }
          const u = userSeries[i] ?? {}
          return {
            ...s,
            ...u,
            itemStyle: {
              ...s.itemStyle,
              borderRadius: [radius, radius, radius, radius],
              ...(gap > 0
                ? {
                    borderColor: gapColor,
                    borderWidth: gap,
                  }
                : {}),
              ...(u.itemStyle ?? {}),
            },
          }
        })
      : series
    return {
      color: $chartColors,
      grid: mergeOptionBlock({ left: 16, right: 16, top: 24, bottom: 32, containLabel: true }, userGrid),
      tooltip: mergeOptionBlock(
        {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
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
  data-slot="stacked-bar-chart"
  class={cn('focus-visible:ring-ring w-full focus-visible:ring-2 focus-visible:outline-none', className)}
  {...restProps}
>
  <div bind:this={container} class="size-full"></div>
  {@render children?.()}
</div>
