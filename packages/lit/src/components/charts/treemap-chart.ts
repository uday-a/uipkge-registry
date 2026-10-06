import { ChartElement } from './lib/chart-element'

export interface TreemapNode {
  name: string
  value?: number
  children?: TreemapNode[]
}

/**
 * <uip-treemap-chart> — the registry TreemapChart (React `TreemapChart`) as
 * a web component. Builds the same ECharts option as React for the same
 * props.
 *
 * Properties (React props): `data` (flat or nested nodes; property or JSON
 * attribute), `height` (default 320), `show-breadcrumb` (default false),
 * `option` (ECharts escape hatch, merged like React), `aria-label` (React
 * `ariaLabel`). React's `className` → host classes.
 */
export class UipTreemapChart extends ChartElement {
  static properties = {
    data: { type: Array },
    showBreadcrumb: { attribute: 'show-breadcrumb', type: Boolean },
    option: { type: Object },
  }

  data: TreemapNode[] = []
  showBreadcrumb = false
  option?: any
  protected readonly chartSlot = 'treemap-chart'

  constructor() {
    super()
    this.height = 320
  }

  protected buildOption() {
    const theme = this.chartTheme
    const series = [
      {
        type: 'treemap',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        width: 'auto',
        height: 'auto',
        roam: false,
        nodeClick: false,
        breadcrumb: { show: this.showBreadcrumb, height: 0 },
        label: {
          show: true,
          formatter: ({ name, value }: any) => (value ? `{b|${name}}\n{v|${value}}` : name),
          rich: {
            b: { color: theme.surfaceColor, fontSize: 12, fontWeight: 600, lineHeight: 16 },
            v: { color: theme.surfaceColor, fontSize: 12, fontWeight: 400, lineHeight: 16 },
          },
          overflow: 'truncate',
          ellipsis: '…',
        },
        labelLayout: { hideOverlap: false },
        upperLabel: { show: false },
        itemStyle: { borderWidth: 0, gapWidth: 2 },
        colorSaturation: [0.45, 0.7],
        data: this.data ?? [],
      },
    ]

    const userOption: any = this.option ?? {}
    const { series: userSeries, ...userRest } = userOption
    const mergedSeries = Array.isArray(userSeries) ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) })) : series

    return {
      color: theme.colors,
      tooltip: {
        formatter: (info: any) => {
          const parts = info.treePathInfo.map((n: any) => n.name).filter(Boolean)
          return `<strong>${parts.join(' / ')}</strong><br>${info.value?.toLocaleString?.() ?? info.value}`
        },
        backgroundColor: theme.tooltipBg,
        borderColor: theme.tooltipBorder,
        textStyle: { color: theme.tooltipText, fontSize: 12 },
      },
      series: mergedSeries,
      ...userRest,
    }
  }
}

customElements.get('uip-treemap-chart') || customElements.define('uip-treemap-chart', UipTreemapChart)

declare global {
  interface HTMLElementTagNameMap {
    'uip-treemap-chart': UipTreemapChart
  }
}
