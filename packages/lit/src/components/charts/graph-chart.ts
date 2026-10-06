import { ChartElement, defaultTrue } from './lib/chart-element'

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

/**
 * <uip-graph-chart> — the registry GraphChart (React `GraphChart`) as a web
 * component. Builds the same ECharts option as React for the same props.
 *
 * Properties (React props): `nodes` ({ name, category?, symbolSize? }[]),
 * `links` ({ source, target, value? }[]), `categories` (legend labels),
 * `layout` ('force' | 'circular' | 'none', default 'force'), `roam` (boolean),
 * `directed` (default true; `directed="false"` hides arrowheads), `height`
 * (default 380), `option` (ECharts escape hatch, merged like React),
 * `aria-label` (React `ariaLabel`). React's `className` → host classes.
 */
export class UipGraphChart extends ChartElement {
  static properties = {
    nodes: { type: Array },
    links: { type: Array },
    categories: { type: Array },
    layout: {},
    roam: { type: Boolean },
    directed: { converter: defaultTrue },
    option: { type: Object },
  }

  nodes: GraphNode[] = []
  links: GraphLink[] = []
  categories?: string[]
  layout: 'force' | 'circular' | 'none' = 'force'
  roam = false
  directed = true
  option?: any
  height: number | string = 380
  protected readonly chartSlot = 'graph-chart'

  protected buildOption() {
    const theme = this.chartTheme
    const { nodes, links, categories, layout, roam, directed, option } = this
    const series = [
      {
        type: 'graph',
        layout,
        roam,
        symbolSize: 28,
        label: { show: true, fontSize: 11, color: theme.textColor },
        edgeSymbol: directed ? (['none', 'arrow'] as [string, string]) : (['none', 'none'] as [string, string]),
        edgeSymbolSize: [0, 6],
        force: { repulsion: 220, edgeLength: 90 },
        lineStyle: { color: theme.axisColor, curveness: 0.15, width: 1 },
        emphasis: { focus: 'adjacency' as const, lineStyle: { width: 2 } },
        categories: categories?.map((name) => ({ name })),
        data: (nodes ?? []).map((n) => ({
          ...n,
          itemStyle:
            typeof n.category === 'number' ? { color: theme.colors[n.category % theme.colors.length] } : undefined,
        })),
        links,
      },
    ]

    const userOption: any = option ?? {}
    const { series: userSeries, ...userRest } = userOption
    const mergedSeries = Array.isArray(userSeries) ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) })) : series

    return {
      color: theme.colors,
      tooltip: {
        trigger: 'item',
        backgroundColor: theme.tooltipBg,
        borderColor: theme.tooltipBorder,
        textStyle: { color: theme.tooltipText, fontSize: 12 },
      },
      legend: categories?.length
        ? {
            bottom: 0,
            icon: 'circle',
            itemWidth: 8,
            itemHeight: 8,
            textStyle: { fontSize: 11, color: theme.textColor },
          }
        : undefined,
      series: mergedSeries,
      ...userRest,
    }
  }
}

customElements.get('uip-graph-chart') || customElements.define('uip-graph-chart', UipGraphChart)

declare global {
  interface HTMLElementTagNameMap {
    'uip-graph-chart': UipGraphChart
  }
}
