<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface RaceFrame {
    /** Frame caption, e.g. a year. */
    label: string
    values: { category: string; value: number }[]
  }

  export interface BarRaceChartProps extends HTMLAttributes<HTMLDivElement> {
    frames: RaceFrame[]
    /** Rows shown per frame. Default 8. */
    topN?: number
    /** Auto-advance. Default true. */
    autoPlay?: boolean
    /** ms per frame. Default 1400. */
    interval?: number
    height?: number | string
    option?: any
    /** Accessible name announced for the chart image. Defaults to "Chart". */
    ariaLabel?: string
    /** The wrapper <div>, via `bind:ref`. */
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { init, use } from 'echarts/core'
  import type { EChartsType } from 'echarts/core'
  import { CanvasRenderer } from 'echarts/renderers'
  import { BarChart as EChartsBarChart } from 'echarts/charts'
  import { GraphicComponent, GridComponent, LegendComponent, TooltipComponent } from 'echarts/components'
  import { cn } from '$lib/utils'
  import { chartTheme, mergeOptionBlock } from './chart-theme.svelte'

  use([CanvasRenderer, EChartsBarChart, GridComponent, TooltipComponent, GraphicComponent, LegendComponent])

  let {
    class: className,
    frames,
    topN = 8,
    autoPlay = true,
    interval = 1400,
    height = 380,
    option = undefined,
    ariaLabel = undefined,
    children,
    ref = $bindable(null),
    ...restProps
  }: BarRaceChartProps = $props()

  // Destructured (not rendered): the chart renders from `frames`, not a slot —
  // this keeps a stray `children` prop out of the wrapper's spread attributes.
  void children

  let chartHost = $state<HTMLDivElement | null>(null)
  let chart: EChartsType | null = null

  let cursor = $state(0)

  $effect(() => {
    if (!autoPlay || frames.length < 2) return
    const timer = setInterval(() => {
      cursor = (cursor + 1) % frames.length
    }, interval)
    return () => clearInterval(timer)
  })

  const frame = $derived(frames[Math.min(cursor, frames.length - 1)] ?? { label: '', values: [] })
  const rows = $derived(
    [...frame.values]
      .sort((a, b) => b.value - a.value)
      .slice(0, topN)
      .reverse(),
  )

  const mergedOption = $derived.by(() => {
    const max = Math.max(...rows.map((r) => r.value), 1)
    const series = [
      {
        type: 'bar',
        barWidth: 16,
        realtimeSort: true,
        itemStyle: { color: chartTheme.colors[0], borderRadius: [6, 6, 6, 6] },
        label: { show: true, position: 'right', color: chartTheme.textColor, fontSize: 11, fontWeight: 600 },
        data: rows.map((r) => r.value),
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
      color: chartTheme.colors,
      animationDurationUpdate: 900,
      animationEasingUpdate: 'quinticInOut',
      graphic: {
        elements: [
          {
            type: 'text',
            right: 16,
            bottom: 8,
            style: { text: frame.label, fontSize: 44, fontWeight: 800, fill: chartTheme.axisColor },
          },
        ],
      },
      grid: mergeOptionBlock({ left: 16, right: 64, top: 16, bottom: 24, containLabel: true }, userGrid),
      tooltip: mergeOptionBlock(
        {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
          backgroundColor: chartTheme.tooltipBg,
          borderColor: chartTheme.tooltipBorder,
          textStyle: { color: chartTheme.tooltipText, fontSize: 12 },
        },
        userTooltip,
      ),
      legend: { show: false },
      xAxis: mergeOptionBlock(
        {
          type: 'value',
          max: max * 1.25,
          splitLine: { lineStyle: { color: chartTheme.splitLineColor } },
          axisLabel: { color: chartTheme.textColor, fontSize: 11 },
        },
        userXAxis,
      ),
      yAxis: mergeOptionBlock(
        {
          type: 'category',
          inverse: true,
          data: rows.map((r) => r.category),
          axisLine: { show: false },
          axisLabel: { color: chartTheme.textColor, fontSize: 11, fontWeight: 600 },
          axisTick: { show: false },
          animationDuration: 300,
          animationDurationUpdate: 300,
        },
        userYAxis,
      ),
      series: mergedSeries,
      ...userRest,
    }
  })

  // Lifecycle owns init/resize/dispose; option pushes ride a separate effect
  // so re-renders merge into the live chart (no re-init, transitions kept).
  $effect(() => {
    const host = chartHost
    if (!host) return
    chart ??= init(host)
    const ro = new ResizeObserver(() => chart?.resize())
    ro.observe(host)
    return () => {
      ro.disconnect()
      chart?.dispose()
      chart = null
    }
  })

  $effect(() => {
    if (!chartHost) return
    chart?.setOption(mergedOption)
  })

  const heightStyle = $derived(`height: ${/^\d+$/.test(String(height)) ? `${height}px` : String(height)}`)
</script>

<div
  bind:this={ref}
  role="img"
  tabindex="0"
  aria-label={ariaLabel || `Bar race chart, frame ${frame.label}`}
  style={heightStyle}
  class={cn('focus-visible:ring-ring w-full focus-visible:ring-2 focus-visible:outline-none', className)}
  {...restProps}
>
  <div bind:this={chartHost} class="size-full"></div>
</div>
