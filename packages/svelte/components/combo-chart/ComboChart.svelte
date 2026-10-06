<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface ComboChartProps extends HTMLAttributes<HTMLDivElement> {
    data: Record<string, any>[]
    xField?: string
    /** Bar series field(s) — left axis. */
    barField?: string | string[]
    /** Line series field(s) — right axis. */
    lineField?: string | string[]
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
  import { BarChart as EChartsBarChart, LineChart as EChartsLineChart } from 'echarts/charts'
  import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
  import { untrack } from 'svelte'
  import { cn } from '$lib/utils'
  import {
    chartColors,
    chartTextColor,
    chartAxisColor,
    chartSplitLineColor,
    chartBgColor,
    chartTooltipBg,
    chartTooltipBorder,
    chartTooltipText,
    mergeOptionBlock,
  } from './useChartTheme'

  use([CanvasRenderer, EChartsBarChart, EChartsLineChart, GridComponent, TooltipComponent, LegendComponent])

  let {
    data,
    xField = 'x',
    barField = 'bar',
    lineField = 'line',
    height = 320,
    option,
    ariaLabel,
    class: className,
    ref = $bindable(null),
    ...restProps
  }: ComboChartProps = $props()

  const mergedOption = $derived.by(() => {
    const bars = Array.isArray(barField) ? barField : [barField]
    const lines = Array.isArray(lineField) ? lineField : [lineField]
    const xData = data.map((d) => d[xField])

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

    const series = [
      ...bars.map((f, i) => {
        const u = Array.isArray(userSeries) ? userSeries[i] : undefined
        const isStacked = Boolean(u?.stack)
        return {
          name: f,
          type: 'bar',
          yAxisIndex: 0,
          barMaxWidth: 28,
          itemStyle: {
            color: $chartColors[i % $chartColors.length],
            borderRadius: [6, 6, 6, 6],
            ...(isStacked
              ? {
                  borderColor: $chartBgColor,
                  borderWidth: 1,
                }
              : {}),
          },
          data: data.map((d) => d[f]),
        }
      }),
      ...lines.map((f, j) => ({
        name: f,
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
        symbol: 'circle',
        symbolSize: 7,
        lineStyle: { width: 2, color: $chartColors[(bars.length + j) % $chartColors.length] },
        itemStyle: { color: $chartColors[(bars.length + j) % $chartColors.length] },
        data: data.map((d) => d[f]),
      })),
    ]

    const mergedSeries = Array.isArray(userSeries)
      ? series.map((s, i) => ({
          ...s,
          ...(userSeries[i] ?? {}),
          itemStyle: {
            ...s.itemStyle,
            ...(userSeries[i]?.itemStyle ?? {}),
          },
        }))
      : series

    return {
      color: $chartColors,
      grid: mergeOptionBlock({ left: 16, right: 16, top: 24, bottom: 32, containLabel: true }, userGrid),
      tooltip: mergeOptionBlock(
        {
          trigger: 'axis',
          backgroundColor: $chartTooltipBg,
          borderColor: $chartTooltipBorder,
          textStyle: { color: $chartTooltipText, fontSize: 12 },
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
          data: xData,
          axisLine: { lineStyle: { color: $chartAxisColor } },
          axisLabel: { color: $chartTextColor, fontSize: 11 },
          axisTick: { show: false },
        },
        userXAxis,
      ),
      yAxis: Array.isArray(userYAxis)
        ? userYAxis
        : [
            mergeOptionBlock(
              {
                type: 'value',
                splitLine: { lineStyle: { color: $chartSplitLineColor } },
                axisLabel: { color: $chartTextColor, fontSize: 11 },
              },
              (userYAxis as any)?.[0],
            ),
            mergeOptionBlock(
              { type: 'value', splitLine: { show: false }, axisLabel: { color: $chartTextColor, fontSize: 11 } },
              (userYAxis as any)?.[1],
            ),
          ],
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
