import { ChartElement } from './lib/chart-element'
import { mergeOptionBlock } from './lib/chart-theme'

/**
 * <uip-effect-scatter-chart> — the registry EffectScatterChart (React
 * `EffectScatterChart`) as a web component. Builds the same ECharts option
 * as React for the same props.
 *
 * Properties (React props): `data` (records; JSON attribute or property),
 * `x-field` (default 'x'), `y-field` (default 'y'), `category-field`,
 * `ripple-period` in seconds (default 4), `height` (default 300), `option`
 * (ECharts escape hatch, merged like React), `aria-label` (React
 * `ariaLabel`). React's `className` → host classes.
 */
export class UipEffectScatterChart extends ChartElement {
  static properties = {
    data: { type: Array },
    xField: { attribute: 'x-field' },
    yField: { attribute: 'y-field' },
    categoryField: { attribute: 'category-field' },
    ripplePeriod: { attribute: 'ripple-period', type: Number },
    option: { type: Object },
  }

  data: Record<string, any>[] = []
  xField = 'x'
  yField = 'y'
  categoryField?: string
  ripplePeriod = 4
  option?: any
  protected readonly chartSlot = 'effect-scatter-chart'

  protected buildOption() {
    const theme = this.chartTheme
    const { xField, yField, categoryField, ripplePeriod } = this
    const data = this.data ?? []
    const categories = categoryField ? [...new Set(data.map((d) => d[categoryField]))] : ['default']
    const series = categories.map((cat, i) => ({
      name: String(cat),
      type: 'effectScatter',
      showEffectOn: 'render',
      rippleEffect: { brushType: 'stroke', period: ripplePeriod, scale: 3 },
      symbolSize: 12,
      itemStyle: {
        color: theme.colors[i % theme.colors.length],
        shadowBlur: 8,
        shadowColor: theme.colors[i % theme.colors.length],
      },
      data: (categoryField ? data.filter((d) => d[categoryField] === cat) : data).map((d) => [d[xField], d[yField]]),
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

    return {
      color: theme.colors,
      grid: mergeOptionBlock(
        { left: 16, right: 16, top: 24, bottom: categories.length > 1 ? 32 : 24, containLabel: true },
        userGrid,
      ),
      tooltip: mergeOptionBlock(
        {
          trigger: 'item',
          backgroundColor: theme.tooltipBg,
          borderColor: theme.tooltipBorder,
          textStyle: { color: theme.tooltipText, fontSize: 12 },
        },
        userTooltip,
      ),
      legend:
        categories.length > 1
          ? mergeOptionBlock(
              {
                bottom: 0,
                icon: 'circle',
                itemWidth: 8,
                itemHeight: 8,
                textStyle: { fontSize: 11, color: theme.textColor },
              },
              userLegend,
            )
          : undefined,
      xAxis: mergeOptionBlock(
        {
          type: 'value',
          scale: true,
          splitLine: { lineStyle: { color: theme.splitLineColor } },
          axisLabel: { color: theme.textColor, fontSize: 11 },
          axisLine: { lineStyle: { color: theme.axisColor } },
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

customElements.get('uip-effect-scatter-chart') ||
  customElements.define('uip-effect-scatter-chart', UipEffectScatterChart)

declare global {
  interface HTMLElementTagNameMap {
    'uip-effect-scatter-chart': UipEffectScatterChart
  }
}
