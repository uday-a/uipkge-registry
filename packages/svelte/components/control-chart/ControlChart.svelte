<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface ControlChartProps extends HTMLAttributes<HTMLDivElement> {
    data: Record<string, any>[]
    xField?: string
    yField?: string
    /** Override computed centre line. Defaults to the data mean. */
    mean?: number
    /** Override computed limits. Default mean ± 2σ. */
    ucl?: number
    lcl?: number
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
  import { GridComponent, TooltipComponent, MarkLineComponent, LegendComponent } from 'echarts/components'
  import { untrack } from 'svelte'
  import { cn } from '$lib/utils'
  import {
    chartColors,
    chartDangerColor,
    chartTextColor,
    chartAxisColor,
    chartSplitLineColor,
    chartTooltipBg,
    chartTooltipBorder,
    chartTooltipText,
    mergeOptionBlock,
  } from './useChartTheme'

  use([CanvasRenderer, EChartsLineChart, GridComponent, TooltipComponent, MarkLineComponent, LegendComponent])

  let {
    data,
    xField = 'x',
    yField = 'value',
    mean: meanOverride,
    ucl: uclOverride,
    lcl: lclOverride,
    height = 300,
    option,
    ariaLabel,
    class: className,
    ref = $bindable(null),
    ...restProps
  }: ControlChartProps = $props()

  const stats = $derived.by(() => {
    const vals = data.map((d) => +d[yField] || 0)
    const mean = meanOverride ?? vals.reduce((s, v) => s + v, 0) / Math.max(1, vals.length)
    const sd = Math.sqrt(vals.reduce((s, v) => s + (v - mean) ** 2, 0) / Math.max(1, vals.length)) || 1
    return { mean, ucl: uclOverride ?? mean + 2 * sd, lcl: lclOverride ?? mean - 2 * sd }
  })

  const mergedOption = $derived.by(() => {
    const { mean, ucl, lcl } = stats
    const line = $chartColors[0]
    const bad = $chartDangerColor
    const series = [
      {
        type: 'line',
        symbol: 'circle',
        symbolSize: 7,
        lineStyle: { width: 2, color: line },
        itemStyle: {
          color: (p: any) => (p.value > ucl || p.value < lcl ? bad : line),
          borderColor: $chartTooltipBg,
          borderWidth: 1.5,
        },
        markLine: {
          silent: true,
          symbol: 'none',
          label: { color: $chartTextColor, fontSize: 10, formatter: '{b}' },
          lineStyle: { type: 'dashed', width: 1 },
          data: [
            { name: 'UCL', yAxis: ucl, lineStyle: { color: bad } },
            { name: 'Mean', yAxis: mean, lineStyle: { color: $chartTextColor } },
            { name: 'LCL', yAxis: lcl, lineStyle: { color: bad } },
          ],
        },
        data: data.map((d) => d[yField]),
      },
    ]
    const userOption: any = option ?? {}
    const {
      series: userSeries,
      xAxis: userXAxis,
      yAxis: userYAxis,
      grid: userGrid,
      tooltip: userTooltip,
      ...userRest
    } = userOption
    const mergedSeries = Array.isArray(userSeries) ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) })) : series
    return {
      color: $chartColors,
      grid: mergeOptionBlock({ left: 16, right: 16, top: 24, bottom: 24, containLabel: true }, userGrid),
      tooltip: mergeOptionBlock(
        {
          trigger: 'axis',
          backgroundColor: $chartTooltipBg,
          borderColor: $chartTooltipBorder,
          textStyle: { color: $chartTooltipText, fontSize: 12 },
        },
        userTooltip,
      ),
      legend: { show: false },
      xAxis: mergeOptionBlock(
        {
          type: 'category',
          data: data.map((d) => d[xField]),
          axisLine: { lineStyle: { color: $chartAxisColor } },
          axisLabel: { color: $chartTextColor, fontSize: 10 },
          axisTick: { show: false },
        },
        userXAxis,
      ),
      yAxis: mergeOptionBlock(
        {
          type: 'value',
          scale: true,
          splitLine: { lineStyle: { color: $chartSplitLineColor } },
          axisLabel: { color: $chartTextColor, fontSize: 11 },
        },
        userYAxis,
      ),
      series: mergedSeries,
      ...userRest,
    }
  })

  let chart: ECharts | null = null

  // Create once per mount; a ResizeObserver replicates VChart's autoresize.
  $effect(() => {
    const el = ref
    if (!el) return
    chart = init(el)
    untrack(() => chart?.setOption(mergedOption))
    const ro = new ResizeObserver(() => chart?.resize())
    ro.observe(el)
    return () => {
      ro.disconnect()
      chart?.dispose()
      chart = null
    }
  })

  // Repaint on data / option / theme changes without recreating the instance.
  $effect(() => {
    const next = mergedOption
    untrack(() => chart?.setOption(next))
  })
</script>

<div
  bind:this={ref}
  role="img"
  tabindex="0"
  aria-label={ariaLabel || 'Chart'}
  style:height={/^\d+$/.test(String(height)) ? `${height}px` : String(height)}
  class={cn('focus-visible:ring-ring w-full focus-visible:ring-2 focus-visible:outline-none', className)}
  {...restProps}
></div>
