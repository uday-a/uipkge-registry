import { ChartElement } from './lib/chart-element'

export interface SunNode {
  name: string
  value?: number
  children?: SunNode[]
}

/**
 * <uip-sunburst-chart> — the registry SunburstChart (React `SunburstChart`)
 * as a web component. Builds the same ECharts option as React for the same
 * props.
 *
 * Properties (React props): `data` (hierarchical nodes; property or JSON
 * attribute), `height` (default 360), `radius` ([inner, outer] percentages;
 * property or JSON attribute; default ['12%', '90%']), `option` (ECharts
 * escape hatch, merged like React), `aria-label` (React `ariaLabel`).
 * React's `className` → host classes.
 */
export class UipSunburstChart extends ChartElement {
  static properties = {
    data: { type: Array },
    radius: { type: Array },
    option: { type: Object },
  }

  data: SunNode[] = []
  radius: [string, string] = ['12%', '90%']
  option?: any
  protected readonly chartSlot = 'sunburst-chart'

  constructor() {
    super()
    this.height = 360
  }

  protected buildOption() {
    const theme = this.chartTheme
    const series = [
      {
        type: 'sunburst',
        radius: this.radius,
        data: this.data ?? [],
        label: { rotate: 'radial' as const, fontSize: 11 },
        itemStyle: { borderColor: '#fff', borderWidth: 1 },
        emphasis: { focus: 'ancestor' as const },
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
}

customElements.get('uip-sunburst-chart') || customElements.define('uip-sunburst-chart', UipSunburstChart)

declare global {
  interface HTMLElementTagNameMap {
    'uip-sunburst-chart': UipSunburstChart
  }
}
