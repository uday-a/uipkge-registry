<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface BoxRow {
    category: string
    /** [min, Q1, median, Q3, max] */
    values: [number, number, number, number, number]
  }

  export interface BoxplotChartProps extends HTMLAttributes<HTMLDivElement> {
    data: BoxRow[]
    /** Render horizontally (categories on y-axis). Default false. */
    horizontal?: boolean
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
  import { BoxplotChart as EChartsBoxplotChart } from 'echarts/charts'
  import { GridComponent, TooltipComponent } from 'echarts/components'
  import { cn } from '$lib/utils'
  import { chartTheme, mergeOptionBlock } from './chart-theme.svelte'

  use([CanvasRenderer, EChartsBoxplotChart, GridComponent, TooltipComponent])

  let {
    class: className,
    data,
    horizontal = false,
    height = 320,
    option = undefined,
    ariaLabel = undefined,
    children,
    ref = $bindable(null),
    ...restProps
  }: BoxplotChartProps = $props()

  // Destructured (not rendered): the chart renders from `data`, not a slot —
  // this keeps a stray `children` prop out of the wrapper's spread attributes.
  void children

  let chartHost = $state<HTMLDivElement | null>(null)
  let chart: EChartsType | null = null

  const mergedOption = $derived.by(() => {
    const cats = data.map((d) => d.category)
    const values = data.map((d) => d.values)

    const valueAxis = {
      type: 'value' as const,
      scale: true,
      splitLine: { lineStyle: { color: chartTheme.splitLineColor } },
      axisLabel: { color: chartTheme.textColor, fontSize: 11 },
      axisLine: { lineStyle: { color: chartTheme.axisColor } },
      axisTick: { show: false },
    }
    const catAxis = {
      type: 'category' as const,
      data: cats,
      axisLine: { lineStyle: { color: chartTheme.axisColor } },
      axisLabel: { color: chartTheme.textColor, fontSize: 11 },
      axisTick: { show: false },
    }

    const series = [
      {
        type: 'boxplot',
        data: values,
        itemStyle: { color: chartTheme.colors[0], borderColor: chartTheme.colors[1] },
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
      grid: mergeOptionBlock({ left: 16, right: 16, top: 24, bottom: 24, containLabel: true }, userGrid),
      tooltip: mergeOptionBlock(
        {
          trigger: 'item',
          backgroundColor: chartTheme.tooltipBg,
          borderColor: chartTheme.tooltipBorder,
          textStyle: { color: chartTheme.tooltipText, fontSize: 12 },
        },
        userTooltip,
      ),
      xAxis: mergeOptionBlock(horizontal ? valueAxis : catAxis, userXAxis),
      yAxis: mergeOptionBlock(horizontal ? catAxis : valueAxis, userYAxis),
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

<div bind:this={ref} role="img" aria-label={ariaLabel || 'Chart'} style={heightStyle} class={cn('w-full', className)} {...restProps}>
  <div bind:this={chartHost} class="size-full"></div>
</div>
