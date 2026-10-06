<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface RangeDatum {
    label: string
    low: number
    high: number
  }

  export interface RangeBarChartProps extends HTMLAttributes<HTMLDivElement> {
    data: RangeDatum[]
    /** 'vertical' columns or 'horizontal' bars. Default 'vertical'. */
    orientation?: 'vertical' | 'horizontal'
    height?: number | string
    option?: any
    /** Accessible name announced for the chart image. Defaults to "Range bar chart". */
    ariaLabel?: string
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { init, use } from 'echarts/core'
  import { CanvasRenderer } from 'echarts/renderers'
  import { BarChart as EChartsBarChart } from 'echarts/charts'
  import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components'
  import { cn } from '$lib/utils'
  import { mergeOptionBlock, resolveChartTheme, watchThemeVersion } from './useChartTheme'

  use([CanvasRenderer, EChartsBarChart, GridComponent, TooltipComponent, LegendComponent])

  let {
    class: className,
    data,
    orientation = 'vertical',
    height = 300,
    option,
    ariaLabel,
    ref = $bindable(null),
    ...restProps
  }: RangeBarChartProps = $props()

  let canvas: HTMLDivElement | null = null
  let chart = $state<ReturnType<typeof init> | null>(null)
  let themeVersion = $state(0)

  $effect(() => watchThemeVersion(() => (themeVersion += 1)))

  const theme = $derived.by(() => {
    themeVersion
    return resolveChartTheme()
  })

  const mergedOption = $derived.by(() => {
    const horizontal = orientation === 'horizontal'
    const series = [
      {
        name: 'base',
        type: 'bar',
        stack: 'range',
        itemStyle: { borderColor: 'transparent', color: 'transparent' },
        emphasis: { itemStyle: { borderColor: 'transparent', color: 'transparent' } },
        data: data.map((d) => d.low),
      },
      {
        name: 'range',
        type: 'bar',
        stack: 'range',
        barMaxWidth: 30,
        itemStyle: { color: theme.colors[0], borderRadius: 5 },
        label: {
          show: true,
          position: horizontal ? 'right' : 'top',
          color: theme.textColor,
          fontSize: 10,
          formatter: (p: any) => {
            const d = data[p.dataIndex]
            return d ? `${d.low}–${d.high}` : ''
          },
        },
        data: data.map((d) => d.high - d.low),
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
    const catAxis = {
      type: 'category' as const,
      data: data.map((d) => d.label),
      axisLine: { lineStyle: { color: theme.axisColor } },
      axisLabel: { color: theme.textColor, fontSize: 11 },
      axisTick: { show: false },
    }
    const valAxis = {
      type: 'value' as const,
      splitLine: { lineStyle: { color: theme.splitLineColor } },
      axisLabel: { color: theme.textColor, fontSize: 11 },
    }
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
          formatter: (ps: any[]) => {
            const d = data[ps[0]?.dataIndex]
            return d ? `${d.label}<br/>${d.low} – ${d.high}` : ''
          },
        },
        userTooltip,
      ),
      legend: { show: false },
      xAxis: mergeOptionBlock(horizontal ? valAxis : catAxis, userXAxis),
      yAxis: mergeOptionBlock(horizontal ? catAxis : valAxis, userYAxis),
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
  aria-label={ariaLabel || 'Range bar chart'}
  data-uipkge=""
  data-slot="range-bar-chart"
  data-orientation={orientation}
  style="height: {heightStyle}"
  class={cn('focus-visible:ring-ring w-full focus-visible:ring-2 focus-visible:outline-none', className)}
  {...restProps}
>
  <div bind:this={canvas} class="size-full"></div>
</div>
