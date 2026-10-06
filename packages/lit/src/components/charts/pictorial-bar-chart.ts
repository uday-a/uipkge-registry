import { ChartElement } from './lib/chart-element'
import { mergeOptionBlock } from './lib/chart-theme'

/**
 * <uip-pictorial-bar-chart> — the registry PictorialBarChart (React
 * `PictorialBarChart`) as a web component. Builds the same ECharts option as
 * React for the same props.
 *
 * Properties (React props): `data` ({ category, value }[]; JSON attribute
 * or property), `symbol` (ECharts symbol for the repeated pictogram;
 * default 'rect'), `height` (default 300), `option` (ECharts escape hatch,
 * merged like React), `aria-label` (React `ariaLabel`). React's `className`
 * → host classes.
 */
export class UipPictorialBarChart extends ChartElement {
  static properties = {
    data: { type: Array },
    symbol: {},
    option: { type: Object },
  }

  data: { category: string; value: number }[] = []
  symbol = 'rect'
  option?: any
  protected readonly chartSlot = 'pictorial-bar-chart'

  protected buildOption() {
    const theme = this.chartTheme
    const data = this.data ?? []
    const max = Math.max(...data.map((d) => d.value), 1)
    const series = [
      {
        type: 'pictorialBar',
        symbol: this.symbol,
        symbolRepeat: true,
        symbolSize: [12, 8],
        symbolMargin: 2,
        symbolClip: true,
        itemStyle: { color: theme.colors[0] },
        data: data.map((d) => ({ value: d.value, symbolBoundingData: max })),
      },
    ]
    const userOption: any = this.option ?? {}
    const {
      series: userSeries,
      xAxis: userXAxis,
      yAxis: userYAxis,
      grid: userGrid,
      tooltip: userTooltip,
      ...userRest
    } = userOption
    const mergedSeries = Array.isArray(userSeries) ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) })) : series

    return {
      color: theme.colors,
      grid: mergeOptionBlock({ left: 16, right: 16, top: 24, bottom: 24, containLabel: true }, userGrid),
      tooltip: mergeOptionBlock(
        {
          trigger: 'item',
          backgroundColor: theme.tooltipBg,
          borderColor: theme.tooltipBorder,
          textStyle: { color: theme.tooltipText, fontSize: 12 },
        },
        userTooltip,
      ),
      xAxis: mergeOptionBlock(
        {
          type: 'category',
          data: data.map((d) => d.category),
          axisLine: { lineStyle: { color: theme.axisColor } },
          axisLabel: { color: theme.textColor, fontSize: 11 },
          axisTick: { show: false },
        },
        userXAxis,
      ),
      yAxis: mergeOptionBlock(
        {
          type: 'value',
          max,
          splitLine: { lineStyle: { color: theme.splitLineColor } },
          axisLabel: { color: theme.textColor, fontSize: 11 },
        },
        userYAxis,
      ),
      series: mergedSeries,
      ...userRest,
    }
  }
}

customElements.get('uip-pictorial-bar-chart') || customElements.define('uip-pictorial-bar-chart', UipPictorialBarChart)

declare global {
  interface HTMLElementTagNameMap {
    'uip-pictorial-bar-chart': UipPictorialBarChart
  }
}
