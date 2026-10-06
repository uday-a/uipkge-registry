import { ChartElement } from './lib/chart-element'
import { mergeOptionBlock } from './lib/chart-theme'

/**
 * <uip-polar-bar-chart> — the registry PolarBarChart (React
 * `PolarBarChart`) as a web component. Builds the same ECharts option as
 * React for the same props.
 *
 * Properties (React props): `data` ({ category, value }[]; JSON attribute
 * or property), `height` (default 320), `option` (ECharts escape hatch,
 * merged like React), `aria-label` (React `ariaLabel`). React's `className`
 * → host classes.
 */
export class UipPolarBarChart extends ChartElement {
  static properties = {
    data: { type: Array },
    option: { type: Object },
  }

  data: { category: string; value: number }[] = []
  option?: any
  protected readonly chartSlot = 'polar-bar-chart'

  constructor() {
    super()
    this.height = 320
  }

  protected buildOption() {
    const theme = this.chartTheme
    const data = this.data ?? []
    const series = [
      {
        type: 'bar',
        coordinateSystem: 'polar',
        data: data.map((d) => d.value),
        colorBy: 'data',
        roundCap: true,
        itemStyle: { borderRadius: 6 },
      },
    ]
    const userOption: any = this.option ?? {}
    const {
      series: userSeries,
      polar: userPolar,
      angleAxis: userAngle,
      radiusAxis: userRadius,
      tooltip: userTooltip,
      legend: userLegend,
      ...userRest
    } = userOption
    const mergedSeries = Array.isArray(userSeries) ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) })) : series

    return {
      color: theme.colors,
      polar: mergeOptionBlock({ radius: ['18%', '78%'] }, userPolar),
      angleAxis: mergeOptionBlock(
        { type: 'value', startAngle: 90, axisLabel: { color: theme.textColor, fontSize: 10 } },
        userAngle,
      ),
      radiusAxis: mergeOptionBlock(
        { type: 'category', data: data.map((d) => d.category), axisLabel: { color: theme.textColor, fontSize: 11 } },
        userRadius,
      ),
      tooltip: mergeOptionBlock(
        {
          trigger: 'item',
          backgroundColor: theme.tooltipBg,
          borderColor: theme.tooltipBorder,
          textStyle: { color: theme.tooltipText, fontSize: 12 },
        },
        userTooltip,
      ),
      legend: userLegend?.show === false ? undefined : mergeOptionBlock({ show: false }, userLegend),
      series: mergedSeries,
      ...userRest,
    }
  }
}

customElements.get('uip-polar-bar-chart') || customElements.define('uip-polar-bar-chart', UipPolarBarChart)

declare global {
  interface HTMLElementTagNameMap {
    'uip-polar-bar-chart': UipPolarBarChart
  }
}
