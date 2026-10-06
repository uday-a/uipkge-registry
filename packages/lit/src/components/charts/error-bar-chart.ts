import { ChartElement } from './lib/chart-element'
import { mergeOptionBlock } from './lib/chart-theme'

export interface ErrorDatum {
  category: string
  value: number
  low: number
  high: number
}

/**
 * <uip-error-bar-chart> — the registry ErrorBarChart (React `ErrorBarChart`)
 * as a web component. Builds the same ECharts option as React for the same
 * props.
 *
 * Properties (React props): `data` ({ category, value, low, high }[]; JSON
 * attribute or property), `height` (default 300), `option` (ECharts escape
 * hatch, merged like React), `aria-label` (React `ariaLabel`; default
 * 'Error bar chart'). React's `className` → host classes.
 */
export class UipErrorBarChart extends ChartElement {
  static properties = {
    data: { type: Array },
    option: { type: Object },
  }

  data: ErrorDatum[] = []
  option?: any
  accessibleLabel: string | undefined = 'Error bar chart'
  protected readonly chartSlot = 'error-bar-chart'

  protected buildOption() {
    const theme = this.chartTheme
    const data = this.data ?? []
    const series = [
      {
        name: 'value',
        type: 'bar',
        barMaxWidth: 30,
        itemStyle: { color: theme.colors[0], borderRadius: [6, 6, 6, 6] },
        data: data.map((d) => d.value),
      },
      {
        name: 'interval',
        type: 'custom',
        silent: true,
        renderItem: (params: any, api: any) => {
          const i: number = params.dataIndex
          const d = data[i]!
          const cx = api.coord([i, 0])[0]
          const yLow = api.coord([i, d.low])[1]
          const yHigh = api.coord([i, d.high])[1]
          const cap = 7
          return {
            type: 'group',
            children: [
              {
                type: 'line',
                shape: { x1: cx, y1: yLow, x2: cx, y2: yHigh },
                style: { stroke: theme.textColor, lineWidth: 1.5 },
              },
              {
                type: 'line',
                shape: { x1: cx - cap, y1: yLow, x2: cx + cap, y2: yLow },
                style: { stroke: theme.textColor, lineWidth: 1.5 },
              },
              {
                type: 'line',
                shape: { x1: cx - cap, y1: yHigh, x2: cx + cap, y2: yHigh },
                style: { stroke: theme.textColor, lineWidth: 1.5 },
              },
            ],
          }
        },
        data: data.map((d) => [d.low, d.high]),
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
    const mergedSeries = Array.isArray(userSeries)
      ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) }))
      : series
    return {
      color: theme.colors,
      grid: mergeOptionBlock({ left: 16, right: 16, top: 24, bottom: 24, containLabel: true }, userGrid),
      tooltip: mergeOptionBlock(
        {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
          backgroundColor: theme.tooltipBg,
          borderColor: theme.tooltipBorder,
          textStyle: { color: theme.tooltipText, fontSize: 12 },
          formatter: (ps: any[]) => {
            const d = data[ps[0]?.dataIndex]
            return d ? `${d.category}<br/>${d.value} (CI ${d.low}–${d.high})` : ''
          },
        },
        userTooltip,
      ),
      legend: { show: false },
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

customElements.get('uip-error-bar-chart') || customElements.define('uip-error-bar-chart', UipErrorBarChart)

declare global {
  interface HTMLElementTagNameMap {
    'uip-error-bar-chart': UipErrorBarChart
  }
}
