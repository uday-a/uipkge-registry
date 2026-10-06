import { ChartElement } from './lib/chart-element'

export interface SankeyLink {
  source: string
  target: string
  value: number
}

// Sankey nodes keep a fixed categorical palette so the same flow retains its
// visual identity across light and dark themes. Labels and tooltip chrome
// still use theme tokens for contrast against the current surface.
const SANKEY_COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#84cc16']

/**
 * <uip-sankey-chart> — the registry SankeyChart (React `SankeyChart`) as a
 * web component. Builds the same ECharts option as React for the same props.
 *
 * Properties (React props): `nodes` (optional string[]; derived from links
 * when omitted), `links` ({ source, target, value }[]), `curveness` (default
 * 0.5), `height` (default 360), `option` (ECharts escape hatch, merged like
 * React), `aria-label` (React `ariaLabel`). React's `className` → host
 * classes.
 */
export class UipSankeyChart extends ChartElement {
  static properties = {
    nodes: { type: Array },
    links: { type: Array },
    curveness: { type: Number },
    option: { type: Object },
  }

  nodes?: string[]
  links: SankeyLink[] = []
  curveness = 0.5
  option?: any
  height: number | string = 360
  protected readonly chartSlot = 'sankey-chart'

  protected buildOption() {
    const theme = this.chartTheme
    const { nodes, links, curveness, option } = this
    const nodeNames = nodes ?? Array.from(new Set((links ?? []).flatMap((l) => [l.source, l.target])))

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
        label: { fontSize: 11, color: theme.tooltipText },
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
        textStyle: { color: theme.tooltipText, fontSize: 12 },
      },
      series: mergedSeries,
      ...userRest,
    }
  }
}

customElements.get('uip-sankey-chart') || customElements.define('uip-sankey-chart', UipSankeyChart)

declare global {
  interface HTMLElementTagNameMap {
    'uip-sankey-chart': UipSankeyChart
  }
}
