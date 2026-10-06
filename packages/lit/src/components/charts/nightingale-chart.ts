import { ChartElement } from './lib/chart-element'
import { mergeOptionBlock } from './lib/chart-theme'

/**
 * <uip-nightingale-chart> — the registry NightingaleChart (React
 * `NightingaleChart`) as a web component. Builds the same ECharts option as
 * React for the same props.
 *
 * Properties (React props): `data` ({ name, value }[]; JSON attribute or
 * property), `height` (default 340), `option` (ECharts escape hatch, merged
 * like React), `aria-label` (React `ariaLabel`). React's `className` → host
 * classes.
 */
export class UipNightingaleChart extends ChartElement {
  static properties = {
    data: { type: Array },
    option: { type: Object },
  }

  data: { name: string; value: number }[] = []
  option?: any
  protected readonly chartSlot = 'nightingale-chart'

  constructor() {
    super()
    this.height = 340
  }

  protected buildOption() {
    const theme = this.chartTheme
    const data = this.data ?? []
    const series = [
      {
        type: 'pie',
        roseType: 'radius',
        radius: ['18%', '72%'],
        center: ['50%', '46%'],
        itemStyle: { borderRadius: 6, borderColor: theme.tooltipBg, borderWidth: 2 },
        label: { color: theme.textColor, fontSize: 11 },
        labelLine: { lineStyle: { color: theme.textColor } },
        data,
      },
    ]
    const userOption: any = this.option ?? {}
    const { series: userSeries, tooltip: userTooltip, legend: userLegend, ...userRest } = userOption
    const mergedSeries = Array.isArray(userSeries) ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) })) : series
    return {
      color: theme.colors,
      tooltip: mergeOptionBlock(
        {
          trigger: 'item',
          backgroundColor: theme.tooltipBg,
          borderColor: theme.tooltipBorder,
          textStyle: { color: theme.tooltipText, fontSize: 12 },
        },
        userTooltip,
      ),
      legend: mergeOptionBlock(
        {
          bottom: 0,
          icon: 'circle',
          itemWidth: 8,
          itemHeight: 8,
          textStyle: { fontSize: 11, color: theme.textColor },
        },
        userLegend,
      ),
      series: mergedSeries,
      ...userRest,
    }
  }
}

customElements.get('uip-nightingale-chart') || customElements.define('uip-nightingale-chart', UipNightingaleChart)

declare global {
  interface HTMLElementTagNameMap {
    'uip-nightingale-chart': UipNightingaleChart
  }
}
