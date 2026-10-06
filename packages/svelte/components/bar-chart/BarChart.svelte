<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface BarChartProps extends HTMLAttributes<HTMLDivElement> {
    data: Record<string, any>[]
    xField?: string
    yField?: string | string[]
    /** Stack series on one baseline. Default false. */
    stacked?: boolean
    /** Gap in px between stacked bar segments. Default 1. Set to 0 to disable. */
    stackGap?: number
    /** Color of the gap between stacked bar segments. Defaults to card background. */
    stackGapColor?: string
    /** Show value labels on top of each bar. Default false. */
    valueLabels?: boolean
    /** Top corner rounding in px. Default 6. */
    radius?: number
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
  import { GridComponent, LegendComponent, MarkAreaComponent, TooltipComponent } from 'echarts/components'
  import { cn } from '$lib/utils'
  import { chartTheme, mergeOptionBlock } from './chart-theme.svelte'

  use([CanvasRenderer, EChartsBarChart, GridComponent, TooltipComponent, LegendComponent, MarkAreaComponent])

  let {
    class: className,
    data,
    xField = 'x',
    yField = 'y',
    stacked = false,
    stackGap = 1,
    stackGapColor = undefined,
    valueLabels = false,
    radius = 6,
    height = 300,
    option = undefined,
    ariaLabel = undefined,
    children,
    ref = $bindable(null),
    ...restProps
  }: BarChartProps = $props()

  // Destructured (not rendered): the chart renders from `data`, not a slot —
  // this keeps a stray `children` prop out of the wrapper's spread attributes.
  void children

  let chartHost = $state<HTMLDivElement | null>(null)
  let chart: EChartsType | null = null

  const mergedOption = $derived.by(() => {
    const fields = Array.isArray(yField) ? yField : [yField]
    const xData = data.map((d) => d[xField!])

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

    const hasUserStack = Array.isArray(userSeries) && userSeries.some((s: any) => Boolean(s?.stack))
    const gap = stackGap
    const gapColor = stackGapColor ?? chartTheme.bgColor

    const defaultRadius = [radius, radius, radius, radius]

    const series = fields.map((field, i) => {
      const u = Array.isArray(userSeries) ? (userSeries[i] ?? {}) : {}
      const isStacked = Boolean(stacked || u?.stack || hasUserStack)

      return {
        // Single-series: blank name so the tooltip doesn't print the raw field key (legend is hidden anyway).
        name: fields.length > 1 ? field : '',
        type: 'bar',
        stack: stacked ? 'bars' : undefined,
        barMaxWidth: 32,
        itemStyle: {
          color: chartTheme.colors[i % chartTheme.colors.length],
          borderRadius: defaultRadius,
          ...(isStacked && gap > 0
            ? {
                borderColor: gapColor,
                borderWidth: gap,
              }
            : {}),
        },
        label: valueLabels
          ? { show: true, position: 'top', color: chartTheme.textColor, fontSize: 11 }
          : undefined,
        data: data.map((d) => d[field]),
      }
    })

    // Per-index series merge + 2-level deep merge for axis/grid/tooltip
    // blocks (see AreaChart for the rule). Lets consumers tweak axisLabel
    // font size without losing the wrapper's `data` / colors.
    const count = Math.max(fields.length, Array.isArray(userSeries) ? userSeries.length : 0)
    const mergedSeries = Array.isArray(userSeries)
      ? Array.from({ length: count }, (_, i) => {
          const s = series[i] ?? {
            type: 'bar',
            barMaxWidth: 32,
            itemStyle: {
              color: chartTheme.colors[i % chartTheme.colors.length],
            },
          }
          const u = userSeries[i] ?? {}
          const isStacked = Boolean(stacked || s.stack || u?.stack || hasUserStack)

          return {
            ...s,
            ...u,
            itemStyle: {
              ...s.itemStyle,
              borderRadius: defaultRadius,
              ...(isStacked && gap > 0
                ? {
                    borderColor: gapColor,
                    borderWidth: gap,
                  }
                : {}),
              ...(u.itemStyle ?? {}),
            },
          }
        })
      : series

    // Single-series charts hide the legend explicitly so ECharts' default
    // doesn't dump the y-field name onto the chart canvas.
    const baseLegend: any =
      fields.length > 1
        ? {
            bottom: 0,
            icon: 'circle',
            itemWidth: 8,
            itemHeight: 8,
            textStyle: { fontSize: 11, color: chartTheme.textColor },
          }
        : { show: false }

    return {
      color: chartTheme.colors,
      grid: mergeOptionBlock(
        { left: 16, right: 16, top: 24, bottom: fields.length > 1 ? 32 : 24, containLabel: true },
        userGrid,
      ),
      tooltip: mergeOptionBlock(
        {
          trigger: 'axis',
          backgroundColor: chartTheme.tooltipBg,
          borderColor: chartTheme.tooltipBorder,
          textStyle: { color: chartTheme.tooltipText, fontSize: 12 },
        },
        userTooltip,
      ),
      legend: userLegend?.show === false ? undefined : mergeOptionBlock(baseLegend, userLegend),
      xAxis: mergeOptionBlock(
        {
          type: 'category',
          data: xData,
          axisLine: { lineStyle: { color: chartTheme.axisColor } },
          axisLabel: { color: chartTheme.textColor, fontSize: 11 },
          axisTick: { show: false },
        },
        userXAxis,
      ),
      yAxis: mergeOptionBlock(
        {
          type: 'value',
          splitLine: { lineStyle: { color: chartTheme.splitLineColor } },
          axisLabel: { color: chartTheme.textColor, fontSize: 11 },
          axisLine: { show: false },
          axisTick: { show: false },
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

  const heightStyle = $derived(
    `height: ${/^\d+$/.test(String(height)) ? `${height}px` : String(height)}`,
  )
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
