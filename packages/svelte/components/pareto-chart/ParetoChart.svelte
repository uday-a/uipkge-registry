<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface ParetoDatum {
    category: string
    value: number
  }

  export interface ParetoChartProps extends HTMLAttributes<HTMLDivElement> {
    /** Unsorted is fine — rows sort descending by value automatically. */
    data: ParetoDatum[]
    height?: number | string
    option?: any
    /** Accessible name announced for the chart image. Defaults to "Chart". */
    ariaLabel?: string
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { init, use, type EChartsType } from 'echarts/core'
  import { CanvasRenderer } from 'echarts/renderers'
  import { BarChart as EChartsBarChart, LineChart as EChartsLineChart } from 'echarts/charts'
  import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components'
  import { cn } from '$lib/utils'
  import { chartTheme, mergeOptionBlock } from './useChartTheme'

  use([CanvasRenderer, EChartsBarChart, EChartsLineChart, GridComponent, TooltipComponent, LegendComponent])

  let {
    class: className,
    data,
    height = 320,
    option,
    ariaLabel,
    ref = $bindable(null),
    ...restProps
  }: ParetoChartProps = $props()

  let chartEl: HTMLDivElement | null = $state(null)
  let chart: EChartsType | null = $state(null)

  const heightStyle = $derived(`height: ${/^\d+$/.test(String(height)) ? `${height}px` : String(height)}`)

  const mergedOption: any = $derived.by(() => {
    const theme = $chartTheme
    const rows = [...data].sort((a, b) => b.value - a.value)
    const total = rows.reduce((s, r) => s + r.value, 0) || 1
    let acc = 0
    const cum = rows.map((r) => {
      acc += r.value
      return +((acc / total) * 100).toFixed(1)
    })
    const series = [
      {
        name: 'value',
        type: 'bar',
        yAxisIndex: 0,
        barMaxWidth: 30,
        itemStyle: { color: theme.colors[0], borderRadius: [6, 6, 6, 6] },
        data: rows.map((r) => r.value),
      },
      {
        name: 'cumulative %',
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
        symbol: 'circle',
        symbolSize: 7,
        lineStyle: { width: 2, color: theme.colors[3] },
        itemStyle: { color: theme.colors[3] },
        data: cum,
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
      color: theme.colors,
      grid: mergeOptionBlock({ left: 16, right: 16, top: 24, bottom: 32, containLabel: true }, userGrid),
      tooltip: mergeOptionBlock(
        {
          trigger: 'axis',
          backgroundColor: theme.tooltipBg,
          borderColor: theme.tooltipBorder,
          textStyle: { color: theme.tooltipText, fontSize: 12 },
        },
        userTooltip,
      ),
      legend: mergeOptionBlock(
        {
          bottom: 0,
          icon: 'circle',
          itemWidth: 8,
          itemHeight: 8,
          textStyle: { fontSize: 11, color: theme.textColor },
        },
        userLegend,
      ),
      xAxis: mergeOptionBlock(
        {
          type: 'category',
          data: rows.map((r) => r.category),
          axisLine: { lineStyle: { color: theme.axisColor } },
          axisLabel: { color: theme.textColor, fontSize: 11, rotate: 20 },
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
                splitLine: { lineStyle: { color: theme.splitLineColor } },
                axisLabel: { color: theme.textColor, fontSize: 11 },
              },
              (userYAxis as any)?.[0],
            ),
            mergeOptionBlock(
              {
                type: 'value',
                max: 100,
                splitLine: { show: false },
                axisLabel: { color: theme.textColor, fontSize: 11, formatter: '{value}%' },
              },
              (userYAxis as any)?.[1],
            ),
          ],
      series: mergedSeries,
      ...userRest,
    }
  })

  $effect(() => {
    if (!chartEl) return
    const instance = init(chartEl)
    chart = instance
    const ro = new ResizeObserver(() => instance.resize())
    ro.observe(chartEl)
    return () => {
      ro.disconnect()
      instance.dispose()
      chart = null
    }
  })

  $effect(() => {
    if (chart) chart.setOption(mergedOption, { notMerge: true })
  })
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -- focusable by design (Vue twin has tabindex=0 too). -->
<div
  bind:this={ref}
  role="img"
  tabindex="0"
  aria-label={ariaLabel || 'Chart'}
  data-uipkge
  data-slot="pareto-chart"
  style={heightStyle}
  class={cn('focus-visible:ring-ring w-full focus-visible:ring-2 focus-visible:outline-none', className)}
  {...restProps}
>
  <div bind:this={chartEl} class="size-full"></div>
</div>
