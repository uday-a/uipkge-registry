import { html } from 'lit'
import { styleMap } from 'lit/directives/style-map.js'
import { ChartElement } from './lib/chart-element'
import { heightToStyle } from './lib/chart-theme'

export interface TreeNode {
  name: string
  value?: number
  children?: TreeNode[]
  /** Collapse this branch on initial render. */
  collapsed?: boolean
}

/**
 * <uip-tree-chart> — the registry TreeChart (React `TreeChart`) as a web
 * component. Builds the same ECharts option as React for the same props.
 *
 * Properties (React props): `data` (root node; property or JSON attribute),
 * `orient` ('LR', 'TB', 'RL', 'BT' or 'radial'; default 'LR'), `roam`
 * (default false), `height` (default 380), `option` (ECharts escape hatch,
 * merged like React), `aria-label` (React `ariaLabel`). React's `className`
 * → host classes.
 *
 * Like React (which passes `focusable={false}` to ChartFrame), the frame is
 * a bare `w-full` div: role="img" but no tabindex or focus ring.
 */
export class UipTreeChart extends ChartElement {
  static properties = {
    data: { type: Object },
    orient: {},
    roam: { type: Boolean },
    option: { type: Object },
  }

  data: TreeNode = { name: '' }
  orient: 'LR' | 'TB' | 'RL' | 'BT' | 'radial' = 'LR'
  roam = false
  option?: any
  protected readonly chartSlot = 'tree-chart'

  constructor() {
    super()
    this.height = 380
  }

  protected buildOption() {
    const theme = this.chartTheme
    const layout = this.orient === 'radial' ? ('radial' as const) : ('orthogonal' as const)
    const series = [
      {
        type: 'tree',
        data: [this.data ?? { name: '' }],
        layout,
        orient: layout === 'orthogonal' ? this.orient : undefined,
        roam: this.roam,
        symbol: 'circle',
        symbolSize: 10,
        initialTreeDepth: -1,
        top: 16,
        bottom: 16,
        left: layout === 'radial' ? '5%' : 16,
        right: layout === 'radial' ? '5%' : 60,
        label: {
          fontSize: 11,
          color: theme.textColor,
          position: layout === 'radial' ? ('inside' as const) : ('right' as const),
          verticalAlign: 'middle' as const,
          align: layout === 'radial' ? ('center' as const) : ('left' as const),
          distance: 6,
        },
        leaves: {
          label: { position: layout === 'radial' ? ('inside' as const) : ('right' as const) },
        },
        lineStyle: { color: theme.axisColor, width: 1.5, curveness: 0.5 },
        emphasis: { focus: 'descendant' as const },
        itemStyle: { color: theme.colors[0], borderColor: theme.colors[0] },
      },
    ]

    const userOption: any = this.option ?? {}
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
      series: mergedSeries,
      ...userRest,
    }
  }

  // React passes focusable={false}: bare w-full frame, no tabindex/focus ring.
  render() {
    return html`<div
      part="base"
      role="img"
      aria-label=${this.accessibleLabel || 'Chart'}
      style=${styleMap({ height: heightToStyle(this.height) })}
      class="w-full"
    >
      <div data-chart class="h-full w-full"></div>
    </div>`
  }
}

customElements.get('uip-tree-chart') || customElements.define('uip-tree-chart', UipTreeChart)

declare global {
  interface HTMLElementTagNameMap {
    'uip-tree-chart': UipTreeChart
  }
}
