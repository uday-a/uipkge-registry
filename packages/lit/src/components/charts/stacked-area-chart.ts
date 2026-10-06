import { ChartElement } from './lib/chart-element'
import { mergeOptionBlock, toRgba } from './lib/chart-theme'

/**
 * <uip-stacked-area-chart> — the registry StackedAreaChart (React
 * `StackedAreaChart`) as a web component. Builds the same ECharts option as
 * React for the same props.
 *
 * Properties (React props): `data` (records; JSON attribute or property),
 * `x-field` (default 'x'), `y-fields` (string[] via property / JSON
 * attribute), `percent`, `height` (default 300), `option` (ECharts escape
 * hatch, merged like React), `aria-label` (React `ariaLabel`). React's
 * `className` → host classes.
 */
export class UipStackedAreaChart extends ChartElement {
  static properties = {
    data: { type: Array },
    xField: { attribute: 'x-field' },
    yFields: { attribute: 'y-fields', type: Array },
    percent: { type: Boolean },
    option: { type: Object },
  }

  data: Record<string, any>[] = []
  xField = 'x'
  yFields: string[] = []
  percent = false
  option?: any
  protected readonly chartSlot = 'stacked-area-chart'

  protected buildOption() {
    const theme = this.chartTheme
    const { xField, yFields, percent } = this
    const data = this.data ?? []
    const totals = data.map((d) => yFields.reduce((s, f) => s + (d[f] ?? 0), 0) || 1)
    const series = yFields.map((f, i) => {
      const c = theme.colors[i % theme.colors.length]
      return {
        name: f,
        type: 'line',
        stack: 'area',
        smooth: true,
        symbol: 'none',
        lineStyle: { width: 1.5, color: c },
        areaStyle: { color: toRgba(c, 0.45) },
        emphasis: { focus: 'series' },
        data: data.map((d, r) => (percent ? ((d[f] ?? 0) / totals[r]!) * 100 : d[f])),
      }
    })
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
          valueFormatter: (v: any) => (percent ? `${(+v).toFixed(1)}%` : v),
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
      xAxis: mergeOptionBlock(
        {
          type: 'category',
          boundaryGap: false,
          data: data.map((d) => d[xField]),
          axisLine: { lineStyle: { color: theme.axisColor } },
          axisLabel: { color: theme.textColor, fontSize: 11 },
          axisTick: { show: false },
        },
        userXAxis,
      ),
      yAxis: mergeOptionBlock(
        percent
          ? {
              type: 'value',
              max: 100,
              splitLine: { lineStyle: { color: theme.splitLineColor } },
              axisLabel: { color: theme.textColor, fontSize: 11, formatter: '{value}%' },
            }
          : {
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

customElements.get('uip-stacked-area-chart') || customElements.define('uip-stacked-area-chart', UipStackedAreaChart)

declare global {
  interface HTMLElementTagNameMap {
    'uip-stacked-area-chart': UipStackedAreaChart
  }
}
