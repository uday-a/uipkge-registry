<script lang="ts" module>
  import { use } from 'echarts/core'
  import { CanvasRenderer } from 'echarts/renderers'
  import { ScatterChart as EChartsScatterChart } from 'echarts/charts'
  import {
    GridComponent,
    TooltipComponent,
    MarkLineComponent,
    MarkAreaComponent,
    LegendComponent,
  } from 'echarts/components'
  import type { HTMLAttributes } from 'svelte/elements'

  use([
    CanvasRenderer,
    EChartsScatterChart,
    GridComponent,
    TooltipComponent,
    MarkLineComponent,
    MarkAreaComponent,
    LegendComponent,
  ])

  export interface QuadrantChartProps extends HTMLAttributes<HTMLDivElement> {
    data: { x: number; y: number; label?: string }[]
    /** Split lines. Default to the data medians. */
    xMid?: number
    yMid?: number
    /** Clockwise from top-right: [stars, question marks, dogs, cash cows]. */
    quadrantLabels?: [string, string, string, string]
    xName?: string
    yName?: string
    height?: number | string
    option?: any
    /** Accessible name announced for the chart image. Defaults to "Chart". */
    ariaLabel?: string
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { init as initChart } from 'echarts/core'
  import type { ECharts } from 'echarts/core'
  import { cn } from '$lib/utils'
  import {
    getChartColors,
    getChartSplitLineColor,
    getChartTextColor,
    getChartTooltipBg,
    getChartTooltipBorder,
    getChartTooltipText,
    mergeOptionBlock,
  } from './useChartTheme.svelte'

  let {
    class: className,
    data,
    xMid,
    yMid,
    quadrantLabels = ['Stars', 'Question marks', 'Dogs', 'Cash cows'],
    xName,
    yName,
    height = 340,
    option,
    ariaLabel,
    ref = $bindable(null),
    ...restProps
  }: QuadrantChartProps = $props()

  function median(vals: number[]) {
    const s = [...vals].sort((a, b) => a - b)
    const m = Math.floor(s.length / 2)
    return s.length % 2 ? s[m]! : ((s[m - 1] ?? 0) + (s[m] ?? 0)) / 2
  }

  const splits = $derived({
    x: xMid ?? median(data.map((d) => d.x)),
    y: yMid ?? median(data.map((d) => d.y)),
  })

  function buildOption() {
    const { x, y } = splits
    const chartColors = getChartColors()
    const chartTextColor = getChartTextColor()
    const quad = (name: string, x0: number | string, x1: number | string, y0: number | string, y1: number | string) => [
      {
        xAxis: x0,
        yAxis: y0,
        itemStyle: { color: chartColors[0], opacity: 0.05 },
        label: {
          show: true,
          position: 'inside',
          color: chartTextColor,
          fontSize: 12,
          fontWeight: 700,
          formatter: name,
        },
      },
      { xAxis: x1, yAxis: y1 },
    ]
    const series = [
      {
        type: 'scatter',
        symbolSize: 12,
        itemStyle: { color: chartColors[0], opacity: 0.85 },
        label: {
          show: true,
          position: 'top',
          color: chartTextColor,
          fontSize: 10,
          formatter: (p: any) => p.value[2] ?? '',
        },
        markLine: {
          silent: true,
          symbol: 'none',
          lineStyle: { type: 'dashed', color: chartTextColor, opacity: 0.6 },
          label: { show: false },
          data: [{ xAxis: x }, { yAxis: y }],
        },
        markArea: {
          silent: true,
          data: [
            quad(quadrantLabels[0], x, 'max', y, 'max'),
            quad(quadrantLabels[1], 'min', x, y, 'max'),
            quad(quadrantLabels[2], 'min', x, 'min', y),
            quad(quadrantLabels[3], x, 'max', 'min', y),
          ],
        },
        data: data.map((d) => [d.x, d.y, d.label ?? '']),
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
    const mergedSeries = Array.isArray(userSeries)
      ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) }))
      : series
    const xs = data.map((d) => d.x)
    const ys = data.map((d) => d.y)
    return {
      color: chartColors,
      grid: mergeOptionBlock({ left: 16, right: 16, top: 24, bottom: 24, containLabel: true }, userGrid),
      tooltip: mergeOptionBlock(
        {
          trigger: 'item',
          backgroundColor: getChartTooltipBg(),
          borderColor: getChartTooltipBorder(),
          textStyle: { color: getChartTooltipText(), fontSize: 12 },
        },
        userTooltip,
      ),
      legend: { show: false },
      xAxis: mergeOptionBlock(
        {
          type: 'value',
          name: xName,
          min: Math.min(...xs) - 1,
          max: Math.max(...xs) + 1,
          nameTextStyle: { color: chartTextColor, fontSize: 10 },
          splitLine: { lineStyle: { color: getChartSplitLineColor() } },
          axisLabel: { color: chartTextColor, fontSize: 11 },
        },
        userXAxis,
      ),
      yAxis: mergeOptionBlock(
        {
          type: 'value',
          name: yName,
          min: Math.min(...ys) - 1,
          max: Math.max(...ys) + 1,
          nameTextStyle: { color: chartTextColor, fontSize: 10 },
          splitLine: { lineStyle: { color: getChartSplitLineColor() } },
          axisLabel: { color: chartTextColor, fontSize: 11 },
        },
        userYAxis,
      ),
      series: mergedSeries,
      ...userRest,
    }
  }

  const mergedOption = $derived(buildOption())

  let container = $state<HTMLDivElement | null>(null)
  let chart: ECharts | null = null

  $effect(() => {
    if (!container) return
    const instance = initChart(container)
    chart = instance
    const ro = new ResizeObserver(() => instance.resize())
    ro.observe(container)
    return () => {
      ro.disconnect()
      instance.dispose()
      if (chart === instance) chart = null
    }
  })

  $effect(() => {
    chart?.setOption(mergedOption)
  })
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex: chart is deliberately focusable so keyboard users reach the labelled image -->
<div
  {...restProps}
  bind:this={ref}
  data-uipkge=""
  data-slot="quadrant-chart"
  role="img"
  tabindex="0"
  aria-label={ariaLabel || 'Chart'}
  style:height={/^\d+$/.test(String(height)) ? `${height}px` : String(height)}
  class={cn('focus-visible:ring-ring w-full focus-visible:ring-2 focus-visible:outline-none', className)}
>
  <div bind:this={container} class="size-full"></div>
</div>
