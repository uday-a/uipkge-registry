<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface SankeyLink {
    source: string
    target: string
    value: number
  }

  export interface SankeyChartProps extends HTMLAttributes<HTMLDivElement> {
    /** Node names. If omitted, derived from the union of link sources + targets. */
    nodes?: string[]
    /** `{ source, target, value }` edges between nodes. */
    links: SankeyLink[]
    height?: number | string
    /** Curvature of the link ribbons. 0 = straight, 1 = max curve. */
    curveness?: number
    option?: any
    /** Accessible name announced for the chart image. Defaults to "Chart". */
    ariaLabel?: string
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { use, init } from 'echarts/core'
  import { CanvasRenderer } from 'echarts/renderers'
  import { SankeyChart as EChartsSankeyChart } from 'echarts/charts'
  import { TooltipComponent, LegendComponent } from 'echarts/components'
  import { cn } from '$lib/utils'
  import { chartTooltipBg, chartTooltipBorder, chartTooltipText } from './chart-theme'

  use([CanvasRenderer, EChartsSankeyChart, TooltipComponent, LegendComponent])

  // Sankey nodes keep a fixed categorical palette so the same flow retains its
  // visual identity across light and dark themes. Labels and tooltip chrome
  // still use theme tokens for contrast against the current surface.
  const SANKEY_COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#84cc16']

  let {
    class: className,
    nodes,
    links,
    height = 360,
    curveness = 0.5,
    option,
    ariaLabel,
    ref = $bindable(null),
    ...restProps
  }: SankeyChartProps = $props()

  let chartEl: HTMLDivElement | null = $state(null)
  let themeTick = $state(0)

  // Bump whenever <html> class/style changes (the typical shadcn dark-mode
  // pivot) so the option below re-resolves and the chart re-paints.
  $effect(() => {
    if (typeof window === 'undefined') return
    const raf = requestAnimationFrame(() => themeTick++)
    const mo = new MutationObserver(() => themeTick++)
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'style', 'data-theme'] })
    return () => {
      cancelAnimationFrame(raf)
      mo.disconnect()
    }
  })

  const mergedOption = $derived.by(() => {
    void themeTick
    const nodeNames = nodes ?? Array.from(new Set(links.flatMap((l) => [l.source, l.target])))

    const series = [
      {
        type: 'sankey',
        left: 16,
        right: 72,
        top: 12,
        bottom: 12,
        data: nodeNames.map((name) => ({ name })),
        links,
        lineStyle: { color: 'gradient', curveness },
        label: { fontSize: 11, color: chartTooltipText() },
        emphasis: { focus: 'adjacency' },
        itemStyle: { borderWidth: 0 },
      },
    ]

    // Per-index series merge — partial overrides keep computed `type`/`data`.
    const userOption: any = option ?? {}
    const { series: userSeries, ...userRest } = userOption
    const mergedSeries = Array.isArray(userSeries) ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) })) : series

    return {
      color: SANKEY_COLORS,
      tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove',
        backgroundColor: chartTooltipBg(),
        borderColor: chartTooltipBorder(),
        textStyle: { color: chartTooltipText(), fontSize: 12 },
      },
      series: mergedSeries,
      ...userRest,
    }
  })

  // ECharts instance owned by the mount effect below; the option effect only
  // ever calls setOption on it (never init twice — that logs a console warning).
  let chartInstance: { setOption: (opt: any, opts?: any) => void; resize: () => void; dispose: () => void } | null =
    null

  $effect(() => {
    if (!chartEl || typeof window === 'undefined') return
    const chart = init(chartEl)
    chartInstance = chart
    const ro = new ResizeObserver(() => chart.resize())
    ro.observe(chartEl)
    return () => {
      ro.disconnect()
      chart.dispose()
      chartInstance = null
    }
  })

  $effect(() => {
    chartInstance?.setOption(mergedOption, { notMerge: false })
  })
</script>

<div
  bind:this={ref}
  role="img"
  aria-label={ariaLabel || 'Chart'}
  style="height: {/^\d+$/.test(String(height)) ? `${height}px` : String(height)};"
  class={cn('w-full', className)}
  {...restProps}
>
  <div bind:this={chartEl} class="size-full"></div>
</div>
