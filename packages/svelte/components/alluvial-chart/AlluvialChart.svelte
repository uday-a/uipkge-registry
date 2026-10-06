<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface AlluvialLink {
    source: string
    target: string
    value: number
  }

  export interface AlluvialChartProps extends HTMLAttributes<HTMLDivElement> {
    /** Node names. If omitted, derived from the union of link sources + targets. */
    nodes?: string[]
    /** `{ source, target, value }` edges between nodes. */
    links: AlluvialLink[]
    height?: number | string
    /** Curvature of the ribbons. 0 = straight, 1 = max curve. */
    curveness?: number
    option?: any
    /** Accessible name announced for the chart image. Defaults to "Alluvial chart". */
    ariaLabel?: string
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { onDestroy } from 'svelte'
  import { use, init, type ECharts } from 'echarts/core'
  import { CanvasRenderer } from 'echarts/renderers'
  import { SankeyChart as EChartsSankeyChart } from 'echarts/charts'
  import { TooltipComponent, LegendComponent } from 'echarts/components'
  import { cn } from '$lib/utils'
  import { getChartTooltipBg, getChartTooltipBorder, getChartTooltipText, getChartTextColor } from './useChartTheme'

  use([CanvasRenderer, EChartsSankeyChart, TooltipComponent, LegendComponent])

  // Sankey nodes keep a fixed categorical palette so the same flow retains
  // its visual identity across light and dark themes (mirrors SankeyChart).
  const SANKEY_COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#84cc16']

  let {
    nodes,
    links,
    height = 420,
    curveness = 0.5,
    option,
    class: className,
    ariaLabel,
    ref = $bindable(null),
    ...restProps
  }: AlluvialChartProps = $props()

  // Re-read CSS-driven palette whenever `<html>` class/style changes (the
  // typical shadcn dark-mode pivot) so the canvas re-paints with the new theme.
  let themeTick = $state(0)

  $effect(() => {
    const observer = new MutationObserver(() => {
      themeTick += 1
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'style', 'data-theme'] })
    return () => observer.disconnect()
  })

  const mergedOption = $derived.by(() => {
    themeTick
    const chartTooltipBg = getChartTooltipBg()
    const chartTooltipBorder = getChartTooltipBorder()
    const chartTooltipText = getChartTooltipText()
    const chartTextColor = getChartTextColor()

    const nodeNames = nodes ?? Array.from(new Set(links.flatMap((l) => [l.source, l.target])))
    const series = [
      {
        type: 'sankey',
        orient: 'vertical',
        top: 16,
        bottom: 40,
        left: 12,
        right: 12,
        data: nodeNames.map((name) => ({ name })),
        links,
        nodeWidth: 14,
        nodeGap: 12,
        lineStyle: { color: 'gradient', curveness },
        label: { fontSize: 10, color: chartTooltipText, position: 'bottom', distance: 4 },
        emphasis: { focus: 'adjacency' },
        itemStyle: { borderWidth: 0 },
      },
    ]
    const userOption: any = option ?? {}
    const { series: userSeries, ...userRest } = userOption
    const mergedSeries = Array.isArray(userSeries)
      ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) }))
      : series
    return {
      color: SANKEY_COLORS,
      tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove',
        backgroundColor: chartTooltipBg,
        borderColor: chartTooltipBorder,
        textStyle: { color: chartTextColor, fontSize: 12 },
      },
      series: mergedSeries,
      ...userRest,
    }
  })

  let chartEl: HTMLDivElement | null = $state(null)
  let chart: ECharts | null = null

  $effect(() => {
    if (!chartEl) return
    chart ??= init(chartEl)
    chart.setOption(mergedOption)
  })

  $effect(() => {
    if (!chartEl) return
    const ro = new ResizeObserver(() => chart?.resize())
    ro.observe(chartEl)
    return () => ro.disconnect()
  })

  onDestroy(() => {
    chart?.dispose()
    chart = null
  })

  const heightStyle = $derived(/^\d+$/.test(String(height)) ? `${height}px` : String(height))
</script>

<!-- Focusable by design: keyboard and screen-reader users land on the labelled chart region. -->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
  bind:this={ref}
  role="img"
  tabindex="0"
  aria-label={ariaLabel || 'Alluvial chart'}
  style:height={heightStyle}
  class={cn('focus-visible:ring-ring w-full focus-visible:ring-2 focus-visible:outline-none', className)}
  {...restProps}
>
  <div bind:this={chartEl} class="size-full"></div>
</div>
