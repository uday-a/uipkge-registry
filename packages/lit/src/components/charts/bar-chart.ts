import { ChartElement, stringOrArray } from './lib/chart-element'
import { mergeOptionBlock } from './lib/chart-theme'

/**
 * <uip-bar-chart> — the registry BarChart (React `BarChart`) as a web
 * component. Builds the same ECharts option as React for the same props.
 *
 * Properties (React props): `data` (records; JSON attribute or property),
 * `x-field` (default 'x'), `y-field` (string, or string[] via property / JSON
 * attribute; default 'y'), `stacked`, `stack-gap` (default 1),
 * `stack-gap-color`, `value-labels`, `radius` (default 6), `height`
 * (default 300), `option` (ECharts escape hatch, merged like React),
 * `aria-label` (React `ariaLabel`). React's `className` → host classes.
 */
export class UipBarChart extends ChartElement {
  static properties = {
    data: { type: Array },
    xField: { attribute: 'x-field' },
    yField: { attribute: 'y-field', converter: stringOrArray },
    stacked: { type: Boolean },
    stackGap: { attribute: 'stack-gap', type: Number },
    stackGapColor: { attribute: 'stack-gap-color' },
    valueLabels: { attribute: 'value-labels', type: Boolean },
    radius: { type: Number },
    option: { type: Object },
  }

  data: Record<string, any>[] = []
  xField = 'x'
  yField: string | string[] = 'y'
  stacked = false
  stackGap = 1
  stackGapColor?: string
  valueLabels = false
  radius = 6
  option?: any
  protected readonly chartSlot = 'bar-chart'

  protected buildOption() {
    const theme = this.chartTheme
    const { xField, yField, stacked, stackGap, stackGapColor, valueLabels, radius } = this
    const data = this.data ?? []
    const fields = Array.isArray(yField) ? yField : [yField]
    const xData = data.map((d) => d[xField])

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

    const hasUserStack = Array.isArray(userSeries) && userSeries.some((s: any) => Boolean(s?.stack))
    const gapColor = stackGapColor ?? theme.bgColor
    const defaultRadius = [radius, radius, radius, radius]

    const series: any[] = fields.map((field, i) => {
      const u = Array.isArray(userSeries) ? (userSeries[i] ?? {}) : {}
      const isSeriesStacked = Boolean(stacked || u?.stack || hasUserStack)

      return {
        name: field,
        type: 'bar',
        stack: stacked ? 'bars' : undefined,
        barMaxWidth: 32,
        itemStyle: {
          color: theme.colors[i % theme.colors.length],
          borderRadius: defaultRadius,
          ...(isSeriesStacked && stackGap > 0
            ? {
                borderColor: gapColor,
                borderWidth: stackGap,
              }
            : {}),
        },
        label: valueLabels ? { show: true, position: 'top', color: theme.textColor, fontSize: 11 } : undefined,
        data: data.map((d) => d[field]),
      }
    })

    const count = Math.max(fields.length, Array.isArray(userSeries) ? userSeries.length : 0)
    const mergedSeries = Array.isArray(userSeries)
      ? Array.from({ length: count }, (_, i) => {
          const s = series[i] ?? {
            type: 'bar',
            barMaxWidth: 32,
            itemStyle: {
              color: theme.colors[i % theme.colors.length],
            },
          }
          const u = userSeries[i] ?? {}
          const isSeriesStacked = Boolean(stacked || s.stack || u?.stack || hasUserStack)

          return {
            ...s,
            ...u,
            itemStyle: {
              ...s.itemStyle,
              borderRadius: defaultRadius,
              ...(isSeriesStacked && stackGap > 0
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

    const baseLegend: any =
      fields.length > 1
        ? {
            bottom: 0,
            icon: 'circle',
            itemWidth: 8,
            itemHeight: 8,
            textStyle: { fontSize: 11, color: theme.textColor },
          }
        : { show: false }

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
      legend: userLegend?.show === false ? undefined : mergeOptionBlock(baseLegend, userLegend),
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

customElements.get('uip-bar-chart') || customElements.define('uip-bar-chart', UipBarChart)

declare global {
  interface HTMLElementTagNameMap {
    'uip-bar-chart': UipBarChart
  }
}
