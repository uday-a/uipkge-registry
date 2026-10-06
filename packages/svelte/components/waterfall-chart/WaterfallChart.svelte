<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface WaterfallDatum {
    label: string
    /** Signed delta. Positive builds up, negative draws down. */
    value: number
  }

  export interface WaterfallChartProps extends HTMLAttributes<HTMLDivElement> {
    data: WaterfallDatum[]
    /** Append a computed Total bar. Default true. */
    showTotal?: boolean
    height?: number | string
    option?: any
    /** Accessible name announced for the chart image. */
    ariaLabel?: string
  }
</script>

<script lang="ts">
  import { onDestroy } from 'svelte'
  import { init, use, type ECharts, type EChartsCoreOption } from 'echarts/core'
  import { CanvasRenderer } from 'echarts/renderers'
  import { BarChart as EChartsBarChart } from 'echarts/charts'
  import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
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
  } from './useChartTheme.svelte'

  use([CanvasRenderer, EChartsBarChart, GridComponent, TooltipComponent, LegendComponent])

  let { data, showTotal = true, height = 320, option, class: className, ariaLabel, ...restProps }: WaterfallChartProps =
    $props()

  let chartEl: HTMLDivElement | null = $state(null)
  let chart: ECharts | null = null

  const mergedOption = $derived.by((): EChartsCoreOption => {
    const colors = chartColors()
    const textColor = chartTextColor()
    const axisColor = chartAxisColor()
    const splitLineColor = chartSplitLineColor()
    const tooltipBg = chartTooltipBg()
    const tooltipBorder = chartTooltipBorder()
    const tooltipText = chartTooltipText()

    const labels: string[] = []
    const base: number[] = []
    const uplift: number[] = []
    const styles: Record<number, string> = {}
    const up = colors[1]!
    const down = colors[3]!
    const totalColor = colors[0]!

    let cursor = 0
    data.forEach((d, i) => {
      labels.push(d.label)
      if (d.value >= 0) {
        base.push(cursor)
        uplift.push(d.value)
        styles[i] = up
      } else {
        base.push(cursor + d.value)
        uplift.push(-d.value)
        styles[i] = down
      }
      cursor += d.value
    })
    if (showTotal) {
      labels.push('Total')
      base.push(0)
      uplift.push(cursor)
      styles[labels.length - 1] = totalColor
    }

    const series = [
      {
        name: 'base',
        type: 'bar',
        stack: 'waterfall',
        itemStyle: { borderColor: 'transparent', color: 'transparent' },
        emphasis: { itemStyle: { borderColor: 'transparent', color: 'transparent' } },
        data: base,
      },
      {
        name: 'value',
        type: 'bar',
        stack: 'waterfall',
        barMaxWidth: 36,
        label: { show: true, position: 'top', color: textColor, fontSize: 11 },
        itemStyle: {
          color: (p: any) => styles[p.dataIndex] ?? totalColor,
          borderRadius: [6, 6, 6, 6],
        },
        data: uplift,
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
      color: colors,
      grid: mergeOptionBlock({ left: 16, right: 16, top: 32, bottom: 24, containLabel: true }, userGrid),
      tooltip: mergeOptionBlock(
        {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
          backgroundColor: tooltipBg,
          borderColor: tooltipBorder,
          textStyle: { color: tooltipText, fontSize: 12 },
        },
        userTooltip,
      ),
      legend: { show: false },
      xAxis: mergeOptionBlock(
        {
          type: 'category',
          data: labels,
          axisLine: { lineStyle: { color: axisColor } },
          axisLabel: { color: textColor, fontSize: 11 },
          axisTick: { show: false },
        },
        userXAxis,
      ),
      yAxis: mergeOptionBlock(
        {
          type: 'value',
          splitLine: { lineStyle: { color: splitLineColor } },
          axisLabel: { color: textColor, fontSize: 11 },
          axisLine: { show: false },
          axisTick: { show: false },
        },
        userYAxis,
      ),
      series: mergedSeries,
      ...userRest,
    }
  })

  // Create once, then push option updates (props or theme flips) into the live chart.
  $effect(() => {
    const el = chartEl
    if (!el) return
    chart ??= init(el)
    chart.setOption(mergedOption)
  })

  // Autoresize with the container, like VChart's autoresize.
  $effect(() => {
    const el = chartEl
    if (!el || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(() => chart?.resize())
    ro.observe(el)
    return () => ro.disconnect()
  })

  onDestroy(() => {
    chart?.dispose()
    chart = null
  })
</script>

<div
  role="img"
  tabindex="0"
  aria-label={ariaLabel || 'Chart'}
  style:height={/^\d+$/.test(String(height)) ? `${height}px` : String(height)}
  class={cn('focus-visible:ring-ring w-full focus-visible:ring-2 focus-visible:outline-none', className)}
  {...restProps}
>
  <div bind:this={chartEl} class="size-full"></div>
</div>
