import { ChartElement } from './lib/chart-element'
import { mergeOptionBlock } from './lib/chart-theme'

/**
 * <uip-stacked-bar-chart> — the registry StackedBarChart (React
 * `StackedBarChart`) as a web component. Builds the same ECharts option as
 * React for the same props.
 *
 * Properties (React props): `data` (records; JSON attribute or property),
 * `x-field` (default 'x'), `y-fields` (string[] via property / JSON
 * attribute), `percent`, `radius` (default 6), `stack-gap` (default 1),
 * `stack-gap-color`, `height` (default 300), `option` (ECharts escape hatch,
 * merged like React), `aria-label` (React `ariaLabel`). React's `className`
 * → host classes.
 */
export class UipStackedBarChart extends ChartElement {
  static properties = {
    data: { type: Array },
    xField: { attribute: 'x-field' },
    yFields: { attribute: 'y-fields', type: Array },
    percent: { type: Boolean },
    radius: { type: Number },
    stackGap: { attribute: 'stack-gap', type: Number },
    stackGapColor: { attribute: 'stack-gap-color' },
    option: { type: Object },
  }

  data: Record<string, any>[] = []
  xField = 'x'
  yFields: string[] = []
  percent = false
  radius = 6
  stackGap = 1
  stackGapColor?: string
  option?: any
  protected readonly chartSlot = 'stacked-bar-chart'

  protected buildOption() {
    const theme = this.chartTheme
    const { xField, yFields, percent, radius, stackGap, stackGapColor } = this
    const data = this.data ?? []
    const totals = data.map((d) => yFields.reduce((s, f) => s + Math.abs(d[f] ?? 0), 0) || 1)
    const series = yFields.map((f, i) => ({
      name: f,
      type: 'bar',
      stack: 'total',
      barMaxWidth: 34,
      itemStyle: {
        color: theme.colors[i % theme.colors.length],
        borderRadius: [radius, radius, radius, radius],
        ...(stackGap > 0
          ? {
              borderColor: stackGapColor ?? theme.bgColor,
              borderWidth: stackGap,
            }
          : {}),
      },
      label: percent
        ? { show: true, color: '#fff', fontSize: 10, formatter: (p: any) => `${Math.round(p.value)}%` }
        : undefined,
      data: data.map((d, r) => (percent ? (Math.abs(d[f] ?? 0) / totals[r]!) * 100 : d[f])),
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

    const count = Math.max(yFields.length, Array.isArray(userSeries) ? userSeries.length : 0)
    const gapColor = stackGapColor ?? theme.bgColor

    const mergedSeries = Array.isArray(userSeries)
      ? Array.from({ length: count }, (_, i) => {
          const s = series[i] ?? {
            name: `series-${i}`,
            type: 'bar',
            stack: 'total',
            barMaxWidth: 34,
            itemStyle: {
              color: theme.colors[i % theme.colors.length],
            },
          }
          const u = userSeries[i] ?? {}
          return {
            ...s,
            ...u,
            itemStyle: {
              ...s.itemStyle,
              borderRadius: [radius, radius, radius, radius],
              ...(stackGap > 0
                ? {
                    borderColor: gapColor,
                    borderWidth: stackGap,
                  }
                : {}),
              ...(u.itemStyle ?? {}),
            },
          }
        })
      : series
    return {
      color: theme.colors,
      grid: mergeOptionBlock({ left: 16, right: 16, top: 24, bottom: 32, containLabel: true }, userGrid),
      tooltip: mergeOptionBlock(
        {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
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

customElements.get('uip-stacked-bar-chart') || customElements.define('uip-stacked-bar-chart', UipStackedBarChart)

declare global {
  interface HTMLElementTagNameMap {
    'uip-stacked-bar-chart': UipStackedBarChart
  }
}
