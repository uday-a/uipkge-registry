<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface ErrorDatum {
    category: string
    value: number
    low: number
    high: number
  }

  export interface ErrorBarChartProps extends HTMLAttributes<HTMLDivElement> {
    data: ErrorDatum[]
    height?: number | string
    option?: any
    /** Accessible name announced for the chart image. Defaults to "Chart". */
    ariaLabel?: string
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { init, use, type ECharts } from 'echarts/core'
  import { CanvasRenderer } from 'echarts/renderers'
  import { BarChart as EChartsBarChart, CustomChart as EChartsCustomChart } from 'echarts/charts'
  import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components'
  import { untrack } from 'svelte'
  import { cn } from '$lib/utils'
  import { mergeOptionBlock, observeThemeBump, resolveChartTheme } from './chart-theme'

  use([CanvasRenderer, EChartsBarChart, EChartsCustomChart, GridComponent, TooltipComponent, LegendComponent])

  let {
    class: className,
    data,
    height = 300,
    option,
    ariaLabel,
    ref = $bindable(null),
    ...restProps
  }: ErrorBarChartProps = $props()

  let container = $state<HTMLDivElement | null>(null)
  let chart = $state<ECharts | null>(null)

  let themeTick = $state(0)
  $effect(() => observeThemeBump(() => themeTick++))

  const theme = $derived.by(() => {
    themeTick
    return resolveChartTheme()
  })

  const mergedOption = $derived.by(() => {
    const series = [
      {
        name: 'value',
        type: 'bar',
        barMaxWidth: 30,
        itemStyle: { color: theme.colors[0], borderRadius: [6, 6, 6, 6] },
        data: data.map((d) => d.value),
      },
      {
        name: 'interval',
        type: 'custom',
        silent: true,
        renderItem: (params: any, api: any) => {
          const i: number = params.dataIndex
          const d = data[i]!
          const cx = api.coord([i, 0])[0]
          const yLow = api.coord([i, d.low])[1]
          const yHigh = api.coord([i, d.high])[1]
          const cap = 7
          return {
            type: 'group',
            children: [
              {
                type: 'line',
                shape: { x1: cx, y1: yLow, x2: cx, y2: yHigh },
                style: { stroke: theme.textColor, lineWidth: 1.5 },
              },
              {
                type: 'line',
                shape: { x1: cx - cap, y1: yLow, x2: cx + cap, y2: yLow },
                style: { stroke: theme.textColor, lineWidth: 1.5 },
              },
              {
                type: 'line',
                shape: { x1: cx - cap, y1: yHigh, x2: cx + cap, y2: yHigh },
                style: { stroke: theme.textColor, lineWidth: 1.5 },
              },
            ],
          }
        },
        data: data.map((d) => [d.low, d.high]),
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
      grid: mergeOptionBlock({ left: 16, right: 16, top: 24, bottom: 24, containLabel: true }, userGrid),
      tooltip: mergeOptionBlock(
        {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
          backgroundColor: theme.tooltipBg,
          borderColor: theme.tooltipBorder,
          textStyle: { color: theme.tooltipText, fontSize: 12 },
          formatter: (ps: any[]) => {
            const d = data[ps[0]?.dataIndex]
            return d ? `${d.category}<br/>${d.value} (CI ${d.low}–${d.high})` : ''
          },
        },
        userTooltip,
      ),
      legend: { show: false },
      xAxis: mergeOptionBlock(
        {
          type: 'category',
          data: data.map((d) => d.category),
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
    const el = container
    if (!el) return
    const instance = init(el)
    chart = instance
    instance.setOption(untrack(() => mergedOption), { notMerge: true })
    const ro = new ResizeObserver(() => instance.resize())
    ro.observe(el)
    return () => {
      ro.disconnect()
      instance.dispose()
      if (untrack(() => chart) === instance) chart = null
    }
  })

  $effect(() => {
    const opt = mergedOption
    untrack(() => chart)?.setOption(opt, { notMerge: true, lazyUpdate: true })
  })

  const heightStyle = $derived(/^\d+$/.test(String(height)) ? `${height}px` : String(height))
</script>

<div
  bind:this={ref}
  role="img"
  tabindex="0"
  aria-label={ariaLabel || 'Error bar chart'}
  style:height={heightStyle}
  class={cn('focus-visible:ring-ring w-full focus-visible:ring-2 focus-visible:outline-none', className)}
  {...restProps}
>
  <div bind:this={container} class="size-full"></div>
</div>
