import { ChartElement } from './lib/chart-element'

/**
 * <uip-pie-chart> — the registry PieChart (React `PieChart`) as a web
 * component. Builds the same ECharts option as React for the same props.
 *
 * Properties (React props): `data` (records; JSON attribute or property),
 * `name-field` (default 'name'), `value-field` (default 'value'), `height`
 * (default 300), `donut` (boolean), `option` (ECharts escape hatch, merged
 * like React), `aria-label` (React `ariaLabel`). React's `className` → host classes.
 */
export class UipPieChart extends ChartElement {
  static properties = {
    data: { type: Array },
    nameField: { attribute: 'name-field' },
    valueField: { attribute: 'value-field' },
    donut: { type: Boolean },
    option: { type: Object },
  }

  data: Record<string, any>[] = []
  nameField = 'name'
  valueField = 'value'
  donut = false
  option?: any
  protected readonly chartSlot = 'pie-chart'

  protected buildOption() {
    const theme = this.chartTheme
    const chartData = (this.data ?? []).map((d) => ({
      name: d[this.nameField],
      value: d[this.valueField],
    }))

    const series = [
      {
        type: 'pie',
        radius: this.donut ? ['45%', '70%'] : '65%',
        center: ['50%', '45%'],
        itemStyle: { borderWidth: 0 },
        label: { show: false },
        data: chartData,
      },
    ]

    const userOption: any = this.option ?? {}
    const { series: userSeries, ...userRest } = userOption
    const mergedSeries = Array.isArray(userSeries)
      ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) }))
      : series

    return {
      color: theme.colors,
      tooltip: {
        trigger: 'item',
        backgroundColor: theme.tooltipBg,
        borderColor: theme.tooltipBorder,
        textStyle: { color: theme.tooltipText, fontSize: 12 },
        formatter: '{b}: {c} ({d}%)',
      },
      legend: {
        bottom: 0,
        icon: 'circle',
        itemWidth: 8,
        itemHeight: 8,
        textStyle: { fontSize: 11 },
      },
      series: mergedSeries,
      ...userRest,
    }
  }
}

customElements.get('uip-pie-chart') || customElements.define('uip-pie-chart', UipPieChart)

declare global {
  interface HTMLElementTagNameMap {
    'uip-pie-chart': UipPieChart
  }
}
