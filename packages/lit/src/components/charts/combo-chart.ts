import { ChartElement, stringOrArray } from './lib/chart-element'
import { mergeOptionBlock } from './lib/chart-theme'

/**
 * <uip-combo-chart> — the registry ComboChart (React `ComboChart`) as a web
 * component. Builds the same ECharts option as React for the same props.
 *
 * Properties (React props): `data` (records; JSON attribute or property),
 * `x-field` (default 'x'), `bar-field` (string, or string[] via property /
 * JSON attribute; default 'bar'), `line-field` (string, or string[] via
 * property / JSON attribute; default 'line'), `height` (default 300),
 * `option` (ECharts escape hatch, merged like React), `aria-label` (React
 * `ariaLabel`). React's `className` → host classes.
 */
export class UipComboChart extends ChartElement {
  static properties = {
    data: { type: Array },
    xField: { attribute: 'x-field' },
    barField: { attribute: 'bar-field', converter: stringOrArray },
    lineField: { attribute: 'line-field', converter: stringOrArray },
    option: { type: Object },
  }

  data: Record<string, any>[] = []
  xField = 'x'
  barField: string | string[] = 'bar'
  lineField: string | string[] = 'line'
  option?: any
  protected readonly chartSlot = 'combo-chart'

  protected buildOption() {
    const theme = this.chartTheme
    const { xField, barField, lineField } = this
    const data = this.data ?? []
    const bars = Array.isArray(barField) ? barField : [barField]
    const lines = Array.isArray(lineField) ? lineField : [lineField]
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

    const series = [
      ...bars.map((f, i) => {
        const u = Array.isArray(userSeries) ? userSeries[i] : undefined
        const isStacked = Boolean(u?.stack)
        return {
          name: f,
          type: 'bar',
          yAxisIndex: 0,
          barMaxWidth: 28,
          itemStyle: {
            color: theme.colors[i % theme.colors.length],
            borderRadius: [6, 6, 6, 6],
            ...(isStacked
              ? {
                  borderColor: theme.bgColor,
                  borderWidth: 1,
                }
              : {}),
          },
          data: data.map((d) => d[f]),
        }
      }),
      ...lines.map((f, j) => ({
        name: f,
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
        symbol: 'circle',
        symbolSize: 7,
        lineStyle: { width: 2, color: theme.colors[(bars.length + j) % theme.colors.length] },
        itemStyle: { color: theme.colors[(bars.length + j) % theme.colors.length] },
        data: data.map((d) => d[f]),
      })),
    ]

    const mergedSeries = Array.isArray(userSeries)
      ? series.map((s, i) => ({
          ...s,
          ...(userSeries[i] ?? {}),
          itemStyle: {
            ...s.itemStyle,
            ...(userSeries[i]?.itemStyle ?? {}),
          },
        }))
      : series

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
        },
        userLegend,
      ),
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
      yAxis: Array.isArray(userYAxis)
        ? userYAxis
        : [
            mergeOptionBlock(
              {
                type: 'value',
                splitLine: { lineStyle: { color: theme.splitLineColor } },
                axisLabel: { color: theme.textColor, fontSize: 11 },
              },
              (userYAxis as any)?.[0],
            ),
            mergeOptionBlock(
              { type: 'value', splitLine: { show: false }, axisLabel: { color: theme.textColor, fontSize: 11 } },
              (userYAxis as any)?.[1],
            ),
          ],
      series: mergedSeries,
      ...userRest,
    }
  }
}

customElements.get('uip-combo-chart') || customElements.define('uip-combo-chart', UipComboChart)

declare global {
  interface HTMLElementTagNameMap {
    'uip-combo-chart': UipComboChart
  }
}
