import { ChartElement, defaultTrue, stringOrArray } from './lib/chart-element'
import { mergeOptionBlock } from './lib/chart-theme'

/**
 * <uip-line-chart> — the registry LineChart (React `LineChart`) as a web
 * component. Builds the same ECharts option as React for the same props.
 *
 * Properties (React props): `data` (records; JSON attribute or property),
 * `x-field` (default 'x'), `y-field` (string, or string[] via property / JSON
 * attribute; default 'y'), `curve` ('smooth' | 'linear' | 'step' |
 * 'stepStart' | 'stepEnd'; default 'smooth'), `stacked`, `markers`
 * (default true; `markers="false"` to hide), `dashed`, `height`
 * (default 300), `option` (ECharts escape hatch, merged like React),
 * `aria-label` (React `ariaLabel`). React's `className` → host classes.
 */
export class UipLineChart extends ChartElement {
  static properties = {
    data: { type: Array },
    xField: { attribute: 'x-field' },
    yField: { attribute: 'y-field', converter: stringOrArray },
    curve: {},
    stacked: { type: Boolean },
    markers: { type: Boolean, converter: defaultTrue },
    dashed: { type: Boolean },
    option: { type: Object },
  }

  data: Record<string, any>[] = []
  xField = 'x'
  yField: string | string[] = 'y'
  curve: 'smooth' | 'linear' | 'step' | 'stepStart' | 'stepEnd' = 'smooth'
  stacked = false
  markers = true
  dashed = false
  option?: any
  protected readonly chartSlot = 'line-chart'

  protected buildOption() {
    const theme = this.chartTheme
    const { xField, yField, curve, stacked, markers, dashed } = this
    const data = this.data ?? []
    const fields = Array.isArray(yField) ? yField : [yField]
    const xData = data.map((d) => d[xField])

    const series = fields.map((field, i) => ({
      name: field,
      type: 'line',
      smooth: curve === 'smooth',
      step: curve === 'step' ? 'middle' : curve === 'stepStart' ? 'start' : curve === 'stepEnd' ? 'end' : false,
      stack: stacked ? 'lines' : undefined,
      symbol: markers ? 'circle' : 'none',
      symbolSize: 6,
      lineStyle: { width: 2, type: dashed ? 'dashed' : 'solid' },
      itemStyle: { color: theme.colors[i % theme.colors.length] },
      data: data.map((d) => d[field]),
    }))

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

    const baseLegend =
      fields.length > 1
        ? {
            bottom: 0,
            icon: 'circle',
            itemWidth: 8,
            itemHeight: 8,
            textStyle: { fontSize: 11, color: theme.textColor },
          }
        : undefined

    return {
      color: theme.colors,
      grid: mergeOptionBlock(
        { left: 16, right: 16, top: 24, bottom: fields.length > 1 ? 32 : 24, containLabel: true },
        userGrid,
      ),
      tooltip: mergeOptionBlock(
        {
          trigger: 'axis',
          backgroundColor: theme.tooltipBg,
          borderColor: theme.tooltipBorder,
          textStyle: { color: theme.tooltipText, fontSize: 12 },
        },
        userTooltip,
      ),
      legend: userLegend?.show === false ? undefined : mergeOptionBlock(baseLegend ?? {}, userLegend),
      xAxis: mergeOptionBlock(
        {
          type: 'category',
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
          axisLine: { show: false },
          axisTick: { show: false },
        },
        userYAxis,
      ),
      series: mergedSeries,
      ...userRest,
    }
  }
}

customElements.get('uip-line-chart') || customElements.define('uip-line-chart', UipLineChart)

declare global {
  interface HTMLElementTagNameMap {
    'uip-line-chart': UipLineChart
  }
}
