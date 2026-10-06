import { ChartElement } from './lib/chart-element'

export interface AlluvialLink {
  source: string
  target: string
  value: number
}

// Sankey nodes keep a fixed categorical palette so the same flow retains its
// visual identity across light and dark themes (mirrors SankeyChart).
const SANKEY_COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#84cc16']

/**
 * <uip-alluvial-chart> — the registry AlluvialChart (React `AlluvialChart`)
 * as a web component. Builds the same ECharts option as React for the same
 * props (vertical-orient sankey).
 *
 * Properties (React props): `nodes` (optional string[]; derived from links
 * when omitted), `links` ({ source, target, value }[]), `curveness` (default
 * 0.5), `height` (default 420), `option` (ECharts escape hatch, merged like
 * React), `aria-label` (React `ariaLabel`, default 'Alluvial chart').
 * React's `className` → host classes.
 */
export class UipAlluvialChart extends ChartElement {
  static properties = {
    nodes: { type: Array },
    links: { type: Array },
    curveness: { type: Number },
    option: { type: Object },
  }

  nodes?: string[]
  links: AlluvialLink[] = []
  curveness = 0.5
  option?: any
  height: number | string = 420
  accessibleLabel = 'Alluvial chart'
  protected readonly chartSlot = 'alluvial-chart'

  protected buildOption() {
    const theme = this.chartTheme
    const { nodes, links, curveness, option } = this
    const nodeNames = nodes ?? Array.from(new Set((links ?? []).flatMap((l) => [l.source, l.target])))
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
        label: { fontSize: 10, color: theme.tooltipText, position: 'bottom', distance: 4 },
        emphasis: { focus: 'adjacency' },
        itemStyle: { borderWidth: 0 },
      },
    ]
    const userOption: any = option ?? {}
    const { series: userSeries, ...userRest } = userOption
    const mergedSeries = Array.isArray(userSeries) ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) })) : series
    return {
      color: SANKEY_COLORS,
      tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove',
        backgroundColor: theme.tooltipBg,
        borderColor: theme.tooltipBorder,
        textStyle: { color: theme.textColor, fontSize: 12 },
      },
      series: mergedSeries,
      ...userRest,
    }
  }
}

customElements.get('uip-alluvial-chart') || customElements.define('uip-alluvial-chart', UipAlluvialChart)

declare global {
  interface HTMLElementTagNameMap {
    'uip-alluvial-chart': UipAlluvialChart
  }
}
