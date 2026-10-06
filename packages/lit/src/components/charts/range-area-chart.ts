import { ChartElement } from './lib/chart-element'
import { mergeOptionBlock, toRgba } from './lib/chart-theme'

/**
 * <uip-range-area-chart> — the registry RangeAreaChart (React
 * `RangeAreaChart`) as a web component. Builds the same ECharts option as
 * React for the same props.
 *
 * Properties (React props): `data` (records; JSON attribute or property),
 * `x-field` (default 'x'), `min-field` (default 'min'), `max-field`
 * (default 'max'), `avg-field` (default 'avg'), `height` (default 300),
 * `option` (ECharts escape hatch, merged like React), `aria-label` (React
 * `ariaLabel`). React's `className` → host classes.
 */
export class UipRangeAreaChart extends ChartElement {
  static properties = {
    data: { type: Array },
    xField: { attribute: 'x-field' },
    minField: { attribute: 'min-field' },
    maxField: { attribute: 'max-field' },
    avgField: { attribute: 'avg-field' },
    option: { type: Object },
  }

  data: Record<string, any>[] = []
  xField = 'x'
  minField = 'min'
  maxField = 'max'
  avgField = 'avg'
  option?: any
  protected readonly chartSlot = 'range-area-chart'

  protected buildOption() {
    const theme = this.chartTheme
    const { xField, minField, maxField, avgField } = this
    const data = this.data ?? []
    const band = theme.colors[0]
    const avg = theme.colors[3]
    const xData = data.map((d) => d[xField])
    const series = [
      {
        name: 'min',
        type: 'line',
        stack: 'band',
        silent: true,
        symbol: 'none',
        lineStyle: { opacity: 0 },
        itemStyle: { opacity: 0 },
        data: data.map((d) => d[minField]),
      },
      {
        name: 'range',
        type: 'line',
        stack: 'band',
        silent: true,
        symbol: 'none',
        lineStyle: { opacity: 0 },
        areaStyle: { color: toRgba(band, 0.22) },
        data: data.map((d) => (d[maxField] ?? 0) - (d[minField] ?? 0)),
      },
      {
        name: avgField,
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: { width: 2, color: avg },
        itemStyle: { color: avg },
        data: data.map((d) => d[avgField]),
      },
    ]
    const userOption: any = this.option ?? {}
    const {
      series: userSeries,
      xAxis: userXAxis,
      yAxis: userYAxis,
      grid: userGrid,
      tooltip: userTooltip,
      legend: userLegend,
      ...userRest
    } = userOption
    const mergedSeries = Array.isArray(userSeries) ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) })) : series
    return {
      color: theme.colors,
      grid: mergeOptionBlock({ left: 16, right: 16, top: 24, bottom: 32, containLabel: true }, userGrid),
      tooltip: mergeOptionBlock(
        {
          trigger: 'axis',
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
          data: [avgField, 'range'],
        },
        userLegend,
      ),
      xAxis: mergeOptionBlock(
        {
          type: 'category',
          boundaryGap: false,
          data: xData,
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

customElements.get('uip-range-area-chart') || customElements.define('uip-range-area-chart', UipRangeAreaChart)

declare global {
  interface HTMLElementTagNameMap {
    'uip-range-area-chart': UipRangeAreaChart
  }
}
