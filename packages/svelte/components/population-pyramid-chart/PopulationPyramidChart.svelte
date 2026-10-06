<script lang="ts" module>
  import { use } from 'echarts/core'
  import { CanvasRenderer } from 'echarts/renderers'
  import { BarChart as EChartsBarChart } from 'echarts/charts'
  import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
  import type { HTMLAttributes } from 'svelte/elements'

  use([CanvasRenderer, EChartsBarChart, GridComponent, TooltipComponent, LegendComponent])

  export interface PopulationPyramidChartProps extends HTMLAttributes<HTMLDivElement> {
    /** One row per age band. */
    data: { band: string; left: number; right: number }[]
    /** Series names for [left, right]. Default ['Male', 'Female']. */
    names?: [string, string]
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
    getChartAxisColor,
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
    names = ['Male', 'Female'],
    height = 340,
    option,
    ariaLabel,
    ref = $bindable(null),
    ...restProps
  }: PopulationPyramidChartProps = $props()

  function buildOption() {
    const chartColors = getChartColors()
    const chartTextColor = getChartTextColor()
    const series = [
      {
        name: names[0],
        type: 'bar',
        stack: 'pop',
        barWidth: 14,
        itemStyle: { color: chartColors[2], borderRadius: [4, 4, 4, 4] },
        label: {
          show: true,
          position: 'left',
          color: chartTextColor,
          fontSize: 10,
          formatter: (p: any) => Math.abs(p.value),
        },
        data: data.map((d) => -Math.abs(d.left)),
      },
      {
        name: names[1],
        type: 'bar',
        stack: 'pop',
        barWidth: 14,
        itemStyle: { color: chartColors[0], borderRadius: [4, 4, 4, 4] },
        label: { show: true, position: 'right', color: chartTextColor, fontSize: 10 },
        data: data.map((d) => Math.abs(d.right)),
      },
    ]
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
    return {
      color: chartColors,
      grid: mergeOptionBlock({ left: 16, right: 16, top: 24, bottom: 32, containLabel: true }, userGrid),
      tooltip: mergeOptionBlock(
        {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
          backgroundColor: getChartTooltipBg(),
          borderColor: getChartTooltipBorder(),
          textStyle: { color: getChartTooltipText(), fontSize: 12 },
          valueFormatter: (v: any) => Math.abs(v),
        },
        userTooltip,
      ),
      legend: mergeOptionBlock(
        {
          bottom: 0,
          icon: 'circle',
          itemWidth: 8,
          itemHeight: 8,
          textStyle: { fontSize: 11, color: chartTextColor },
        },
        userLegend,
      ),
      xAxis: mergeOptionBlock(
        {
          type: 'value',
          splitLine: { lineStyle: { color: getChartSplitLineColor() } },
          axisLabel: { color: chartTextColor, fontSize: 11, formatter: (v: number) => Math.abs(v) },
        },
        userXAxis,
      ),
      yAxis: mergeOptionBlock(
        {
          type: 'category',
          inverse: true,
          data: data.map((d) => d.band),
          axisLine: { lineStyle: { color: getChartAxisColor() } },
          axisLabel: { color: chartTextColor, fontSize: 11 },
          axisTick: { show: false },
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
  data-slot="population-pyramid-chart"
  role="img"
  tabindex="0"
  aria-label={ariaLabel || 'Chart'}
  style:height={/^\d+$/.test(String(height)) ? `${height}px` : String(height)}
  class={cn('focus-visible:ring-ring w-full focus-visible:ring-2 focus-visible:outline-none', className)}
>
  <div bind:this={container} class="size-full"></div>
</div>
