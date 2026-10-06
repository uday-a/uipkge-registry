<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface BeeswarmChartProps extends HTMLAttributes<HTMLDivElement> {
    data: Record<string, any>[]
    valueField?: string
    groupField?: string
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
  import { ScatterChart as EChartsScatterChart } from 'echarts/charts'
  import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components'
  import { cn } from '$lib/utils'
  import { chartTheme, mergeOptionBlock } from './chart-theme.svelte'

  use([CanvasRenderer, EChartsScatterChart, GridComponent, TooltipComponent, LegendComponent])

  // Deterministic jitter so SSR + client render identical points.
  function jitter(i: number, salt: number) {
    const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453
    return (x - Math.floor(x) - 0.5) * 0.72
  }

  let {
    class: className,
    data,
    valueField = 'value',
    groupField = 'group',
    height = 300,
    option = undefined,
    ariaLabel = undefined,
    children,
    ref = $bindable(null),
    ...restProps
  }: BeeswarmChartProps = $props()

  // Destructured (not rendered): the chart renders from `data`, not a slot —
  // this keeps a stray `children` prop out of the wrapper's spread attributes.
  void children

  let chartHost = $state<HTMLDivElement | null>(null)
  let chart: EChartsType | null = null

  const mergedOption = $derived.by(() => {
    const groups = [...new Set(data.map((d) => String(d[groupField])))]
    const series = groups.map((g, gi) => ({
      name: g,
      type: 'scatter',
      symbolSize: 9,
      itemStyle: { color: chartTheme.colors[gi % chartTheme.colors.length], opacity: 0.8 },
      data: data
        .map((d, i) => ({ d, i }))
        .filter(({ d }) => String(d[groupField]) === g)
        .map(({ d, i }) => [d[valueField], gi + jitter(i, gi)]),
    }))
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
    const mergedSeries = Array.isArray(userSeries) ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) })) : series
    return {
      color: chartTheme.colors,
      grid: mergeOptionBlock(
        { left: 16, right: 16, top: 24, bottom: groups.length > 1 ? 32 : 24, containLabel: true },
        userGrid,
      ),
      tooltip: mergeOptionBlock(
        {
          trigger: 'item',
          backgroundColor: chartTheme.tooltipBg,
          borderColor: chartTheme.tooltipBorder,
          textStyle: { color: chartTheme.tooltipText, fontSize: 12 },
        },
        userTooltip,
      ),
      legend:
        groups.length > 1
          ? mergeOptionBlock(
              {
                bottom: 0,
                icon: 'circle',
                itemWidth: 8,
                itemHeight: 8,
                textStyle: { fontSize: 11, color: chartTheme.textColor },
              },
              userLegend,
            )
          : undefined,
      xAxis: mergeOptionBlock(
        {
          type: 'value',
          scale: true,
          splitLine: { lineStyle: { color: chartTheme.splitLineColor } },
          axisLabel: { color: chartTheme.textColor, fontSize: 11 },
          axisLine: { lineStyle: { color: chartTheme.axisColor } },
        },
        userXAxis,
      ),
      yAxis: mergeOptionBlock(
        {
          type: 'value',
          min: -0.6,
          max: groups.length - 0.4,
          interval: 1,
          axisLabel: { color: chartTheme.textColor, fontSize: 11, formatter: (v: number) => groups[Math.round(v)] ?? '' },
          splitLine: { show: false },
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
  aria-label={ariaLabel || 'Chart'}
  style={heightStyle}
  class={cn('focus-visible:ring-ring w-full focus-visible:ring-2 focus-visible:outline-none', className)}
  {...restProps}
>
  <div bind:this={chartHost} class="size-full"></div>
</div>
