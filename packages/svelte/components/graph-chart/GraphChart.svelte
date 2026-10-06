<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface GraphNode {
    name: string
    /** Optional category index (paints with chart-N colour). */
    category?: number
    /** Optional fixed marker size. Defaults to 28. */
    symbolSize?: number
  }

  export interface GraphLink {
    source: string
    target: string
    /** Optional edge value (shows up in the tooltip + sizes the line on weighted layouts). */
    value?: number
  }

  export interface GraphChartProps extends HTMLAttributes<HTMLDivElement> {
    nodes: GraphNode[]
    links: GraphLink[]
    /** Optional category labels rendered in the legend. */
    categories?: string[]
    /** Layout engine. `force` is force-directed (default), `circular` arranges
     *  on a ring, `none` lets you place nodes manually via `x`/`y`. */
    layout?: 'force' | 'circular' | 'none'
    /** Allow click-and-drag pan + scroll zoom. Default false. */
    roam?: boolean
    /** Draw arrowheads on the target end. Default true. */
    directed?: boolean
    height?: number | string
    option?: any
    /** Accessible name announced for the chart image. Defaults to "Chart". */
    ariaLabel?: string
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { init as echartsInit, use as echartsUse, type ECharts, type EChartsCoreOption } from 'echarts/core'
  import { CanvasRenderer } from 'echarts/renderers'
  import { GraphChart as EChartsGraphChart } from 'echarts/charts'
  import { LegendComponent, TooltipComponent } from 'echarts/components'
  import { cn } from '$lib/utils'
  import {
    chartAxisColor,
    chartColors,
    chartTextColor,
    chartTooltipBg,
    chartTooltipBorder,
    chartTooltipText,
  } from './useChartTheme.svelte'

  echartsUse([CanvasRenderer, EChartsGraphChart, TooltipComponent, LegendComponent])

  let {
    class: className,
    nodes,
    links,
    categories,
    layout = 'force',
    roam = false,
    directed = true,
    height = 380,
    option,
    ariaLabel,
    ref = $bindable(null),
    ...restProps
  }: GraphChartProps = $props()

  let chart = $state<ECharts | null>(null)
  let chartEl = $state<HTMLDivElement | null>(null)

  const mergedOption = $derived.by((): EChartsCoreOption => {
    const series = [
      {
        type: 'graph',
        layout,
        roam,
        symbolSize: 28,
        label: { show: true, fontSize: 11, color: chartTextColor() },
        edgeSymbol: directed ? (['none', 'arrow'] as [string, string]) : (['none', 'none'] as [string, string]),
        edgeSymbolSize: [0, 6],
        force: { repulsion: 220, edgeLength: 90 },
        lineStyle: { color: chartAxisColor(), curveness: 0.15, width: 1 },
        emphasis: { focus: 'adjacency' as const, lineStyle: { width: 2 } },
        categories: categories?.map((name) => ({ name })),
        data: nodes.map((n) => ({
          ...n,
          itemStyle:
            typeof n.category === 'number'
              ? { color: chartColors()[n.category % chartColors().length] }
              : undefined,
        })),
        links,
      },
    ]

    const userOption: any = option ?? {}
    const { series: userSeries, ...userRest } = userOption
    const mergedSeries = Array.isArray(userSeries)
      ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) }))
      : series

    return {
      color: chartColors(),
      tooltip: {
        trigger: 'item',
        backgroundColor: chartTooltipBg(),
        borderColor: chartTooltipBorder(),
        textStyle: { color: chartTooltipText(), fontSize: 12 },
      },
      legend: categories?.length
        ? {
            bottom: 0,
            icon: 'circle',
            itemWidth: 8,
            itemHeight: 8,
            textStyle: { fontSize: 11, color: chartTextColor() },
          }
        : undefined,
      series: mergedSeries,
      ...userRest,
    }
  })

  $effect(() => {
    if (!chartEl) return
    const el = chartEl
    const instance = echartsInit(el)
    chart = instance
    const ro = new ResizeObserver(() => instance.resize())
    ro.observe(el)
    return () => {
      ro.disconnect()
      instance.dispose()
      if (chart === instance) chart = null
    }
  })

  $effect(() => {
    chart?.setOption(mergedOption, { notMerge: true })
  })
</script>

<div
  bind:this={ref}
  role="img"
  aria-label={ariaLabel || 'Chart'}
  style={`height: ${/^\d+$/.test(String(height)) ? `${height}px` : String(height)}`}
  class={cn('w-full', className)}
  data-uipkge
  data-slot="graph-chart"
  {...restProps}
>
  <div bind:this={chartEl} class="size-full"></div>
</div>
