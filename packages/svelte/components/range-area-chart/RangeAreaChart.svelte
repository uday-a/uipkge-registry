<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface RangeAreaChartProps extends HTMLAttributes<HTMLDivElement> {
    data: Record<string, any>[]
    xField?: string
    minField?: string
    maxField?: string
    avgField?: string
    height?: number | string
    option?: any
    /** Accessible name announced for the chart image. Defaults to "Chart". */
    ariaLabel?: string
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { init, use } from 'echarts/core'
  import { CanvasRenderer } from 'echarts/renderers'
  import { LineChart as EChartsLineChart } from 'echarts/charts'
  import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components'
  import { cn } from '$lib/utils'
  import { mergeOptionBlock, resolveChartTheme, toRgba, watchThemeVersion } from './useChartTheme'

  use([CanvasRenderer, EChartsLineChart, GridComponent, TooltipComponent, LegendComponent])

  let {
    class: className,
    data,
    xField = 'x',
    minField = 'min',
    maxField = 'max',
    avgField = 'avg',
    height = 320,
    option,
    ariaLabel,
    ref = $bindable(null),
    ...restProps
  }: RangeAreaChartProps = $props()

  let canvas: HTMLDivElement | null = null
  let chart = $state<ReturnType<typeof init> | null>(null)
  let themeVersion = $state(0)

  $effect(() => watchThemeVersion(() => (themeVersion += 1)))

  const theme = $derived.by(() => {
    themeVersion
    return resolveChartTheme()
  })

  const mergedOption = $derived.by(() => {
    const band = theme.colors[0]
    const avg = theme.colors[3]
    const xData = data.map((d) => d[xField])
    const series = [
      {
        name: 'min',
        type: 'line',
        stack: 'band',
        silent: true,
        symbol: 'none',
        lineStyle: { opacity: 0 },
        itemStyle: { opacity: 0 },
        data: data.map((d) => d[minField]),
      },
      {
        name: 'range',
        type: 'line',
        stack: 'band',
        silent: true,
        symbol: 'none',
        lineStyle: { opacity: 0 },
        areaStyle: { color: toRgba(band, 0.22) },
        data: data.map((d) => (d[maxField] ?? 0) - (d[minField] ?? 0)),
      },
      {
        name: avgField,
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: { width: 2, color: avg },
        itemStyle: { color: avg },
        data: data.map((d) => d[avgField]),
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
          data: [avgField, 'range'],
        },
        userLegend,
      ),
      xAxis: mergeOptionBlock(
        {
          type: 'category',
          boundaryGap: false,
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
        },
        userYAxis,
      ),
      series: mergedSeries,
      ...userRest,
    }
  })

  $effect(() => {
    if (!canvas) return
    const instance = init(canvas)
    chart = instance
    const ro = new ResizeObserver(() => instance.resize())
    ro.observe(canvas)
    return () => {
      ro.disconnect()
      instance.dispose()
      if (chart === instance) chart = null
    }
  })

  $effect(() => {
    chart?.setOption(mergedOption, { notMerge: true, lazyUpdate: true })
  })

  const heightStyle = $derived(/^\d+$/.test(String(height)) ? `${height}px` : String(height))
</script>

<!-- tabindex on a role="img" frame mirrors the Vue twin: keyboard users can focus the chart region. -->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
  bind:this={ref}
  role="img"
  tabindex="0"
  aria-label={ariaLabel || 'Chart'}
  data-uipkge=""
  data-slot="range-area-chart"
  style="height: {heightStyle}"
  class={cn('focus-visible:ring-ring w-full focus-visible:ring-2 focus-visible:outline-none', className)}
  {...restProps}
>
  <div bind:this={canvas} class="size-full"></div>
</div>
