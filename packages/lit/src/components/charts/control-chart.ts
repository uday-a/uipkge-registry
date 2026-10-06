import { ChartElement } from './lib/chart-element'
import { mergeOptionBlock } from './lib/chart-theme'

/**
 * <uip-control-chart> — the registry ControlChart (React `ControlChart`) as
 * a web component. Builds the same ECharts option as React for the same
 * props.
 *
 * Properties (React props): `data` (records; JSON attribute or property),
 * `x-field` (default 'x'), `y-field` (default 'value'), `mean` (override
 * computed centre line; defaults to the data mean), `ucl` / `lcl`
 * (override computed limits; default mean ± 2σ), `height` (default 300),
 * `option` (ECharts escape hatch, merged like React), `aria-label` (React
 * `ariaLabel`). React's `className` → host classes.
 */
export class UipControlChart extends ChartElement {
  static properties = {
    data: { type: Array },
    xField: { attribute: 'x-field' },
    yField: { attribute: 'y-field' },
    mean: { type: Number },
    ucl: { type: Number },
    lcl: { type: Number },
    option: { type: Object },
  }

  data: Record<string, any>[] = []
  xField = 'x'
  yField = 'value'
  mean?: number
  ucl?: number
  lcl?: number
  option?: any
  protected readonly chartSlot = 'control-chart'

  protected buildOption() {
    const theme = this.chartTheme
    const { xField, yField, mean: meanProp, ucl: uclProp, lcl: lclProp } = this
    const data = this.data ?? []
    const vals = data.map((d) => +d[yField] || 0)
    const mean = meanProp ?? vals.reduce((s, v) => s + v, 0) / Math.max(1, vals.length)
    const sd = Math.sqrt(vals.reduce((s, v) => s + (v - mean) ** 2, 0) / Math.max(1, vals.length)) || 1
    const ucl = uclProp ?? mean + 2 * sd
    const lcl = lclProp ?? mean - 2 * sd
    const line = theme.colors[0]
    const bad = theme.dangerColor
    const series = [
      {
        type: 'line',
        symbol: 'circle',
        symbolSize: 7,
        lineStyle: { width: 2, color: line },
        itemStyle: {
          color: (p: any) => (p.value > ucl || p.value < lcl ? bad : line),
          borderColor: theme.tooltipBg,
          borderWidth: 1.5,
        },
        markLine: {
          silent: true,
          symbol: 'none',
          label: { color: theme.textColor, fontSize: 10, formatter: '{b}' },
          lineStyle: { type: 'dashed', width: 1 },
          data: [
            { name: 'UCL', yAxis: ucl, lineStyle: { color: bad } },
            { name: 'Mean', yAxis: mean, lineStyle: { color: theme.textColor } },
            { name: 'LCL', yAxis: lcl, lineStyle: { color: bad } },
          ],
        },
        data: data.map((d) => d[yField]),
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
          trigger: 'axis',
          backgroundColor: theme.tooltipBg,
          borderColor: theme.tooltipBorder,
          textStyle: { color: theme.tooltipText, fontSize: 12 },
        },
        userTooltip,
      ),
      legend: { show: false },
      xAxis: mergeOptionBlock(
        {
          type: 'category',
          data: data.map((d) => d[xField]),
          axisLine: { lineStyle: { color: theme.axisColor } },
          axisLabel: { color: theme.textColor, fontSize: 10 },
          axisTick: { show: false },
        },
        userXAxis,
      ),
      yAxis: mergeOptionBlock(
        {
          type: 'value',
          scale: true,
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

customElements.get('uip-control-chart') || customElements.define('uip-control-chart', UipControlChart)

declare global {
  interface HTMLElementTagNameMap {
    'uip-control-chart': UipControlChart
  }
}
