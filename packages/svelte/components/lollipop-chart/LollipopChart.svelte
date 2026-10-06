<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface LollipopChartProps extends HTMLAttributes<HTMLDivElement> {
    data: { category: string; value: number }[]
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
  import { BarChart as EChartsBarChart, ScatterChart as EChartsScatterChart } from 'echarts/charts'
  import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
  import { cn } from '$lib/utils'
  import { useChartTheme, mergeOptionBlock } from './useChartTheme.svelte'

  use([CanvasRenderer, EChartsBarChart, EChartsScatterChart, GridComponent, TooltipComponent, LegendComponent])

  let {
    data,
    height = 300,
    option,
    ariaLabel,
    class: className,
    ref = $bindable(null),
    ...restProps
  }: LollipopChartProps = $props()

  const mergedOption: any = $derived.by(() => {
    const theme = useChartTheme()
    const cats = data.map((d) => d.category)
    const vals = data.map((d) => d.value)
    const series = [
      {
        name: 'stem',
        type: 'bar',
        barWidth: 3,
        silent: true,
        itemStyle: { color: theme.axisColor },
        data: vals,
      },
      {
        name: 'value',
        type: 'scatter',
        symbolSize: 14,
        itemStyle: { color: theme.colors[0] },
        label: { show: true, position: 'top', color: theme.textColor, fontSize: 11 },
        data: vals.map((v, i) => [cats[i], v]),
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
    return {
      color: theme.colors,
      grid: mergeOptionBlock({ left: 16, right: 16, top: 32, bottom: 24, containLabel: true }, userGrid),
      tooltip: mergeOptionBlock(
        {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
          backgroundColor: theme.tooltipBg,
          borderColor: theme.tooltipBorder,
          textStyle: { color: theme.tooltipText, fontSize: 12 },
        },
        userTooltip,
      ),
      legend: { show: false },
      xAxis: mergeOptionBlock(
        {
          type: 'category',
          data: cats,
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
  data-slot="lollipop-chart"
  role="img"
  tabindex="0"
  aria-label={ariaLabel || 'Chart'}
  style:height={/^\d+$/.test(String(height)) ? `${height}px` : String(height)}
  class={cn('focus-visible:ring-ring w-full focus-visible:ring-2 focus-visible:outline-none', className)}
  {...restProps}
>
  <div bind:this={chartEl} class="size-full"></div>
</div>
