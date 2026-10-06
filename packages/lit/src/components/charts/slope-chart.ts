import { ChartElement } from './lib/chart-element'
import { mergeOptionBlock } from './lib/chart-theme'

export interface SlopeDatum {
  /** One line per entry. Two values = slope chart, more = bump chart. */
  label: string
  values: number[]
}

/**
 * <uip-slope-chart> — the registry SlopeChart (React `SlopeChart`) as a web
 * component. Builds the same ECharts option as React for the same props.
 *
 * Properties (React props): `data` (SlopeDatum[]; JSON attribute or
 * property), `points` (point labels, e.g. ['2024', '2025']; property or JSON
 * attribute), `height` (default 320), `option` (ECharts escape hatch,
 * merged like React), `aria-label` (React `ariaLabel`). React's `className`
 * → host classes.
 */
export class UipSlopeChart extends ChartElement {
  static properties = {
    data: { type: Array },
    points: { type: Array },
    option: { type: Object },
  }

  data: SlopeDatum[] = []
  points: string[] = []
  option?: any
  protected readonly chartSlot = 'slope-chart'

  constructor() {
    super()
    this.height = 320
  }

  protected buildOption() {
    const theme = this.chartTheme
    const data = this.data ?? []
    const series = data.map((d, i) => ({
      name: d.label,
      type: 'line',
      symbol: 'circle',
      symbolSize: 7,
      lineStyle: { width: 2, color: theme.colors[i % theme.colors.length] },
      itemStyle: { color: theme.colors[i % theme.colors.length] },
      label: {
        show: true,
        position: i % 2 ? 'right' : 'left',
        color: theme.textColor,
        fontSize: 10,
        formatter: '{a}',
      },
      endLabel: { show: true, color: theme.textColor, fontSize: 10, formatter: '{a}' },
      data: d.values,
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
      grid: mergeOptionBlock({ left: 16, right: 64, top: 24, bottom: 24, containLabel: false }, userGrid),
      tooltip: mergeOptionBlock(
        {
          trigger: 'axis',
          backgroundColor: theme.tooltipBg,
          borderColor: theme.tooltipBorder,
          textStyle: { color: theme.tooltipText, fontSize: 12 },
        },
        userTooltip,
      ),
      legend: userLegend?.show === false ? undefined : mergeOptionBlock({ show: false }, userLegend),
      xAxis: mergeOptionBlock(
        {
          type: 'category',
          boundaryGap: false,
          data: this.points ?? [],
          axisLine: { lineStyle: { color: theme.axisColor } },
          axisLabel: { color: theme.textColor, fontSize: 11, fontWeight: 600 },
          axisTick: { show: false },
        },
        userXAxis,
      ),
      yAxis: mergeOptionBlock({ type: 'value', show: false, splitLine: { show: false } }, userYAxis),
      series: mergedSeries,
      ...userRest,
    }
  }
}

customElements.get('uip-slope-chart') || customElements.define('uip-slope-chart', UipSlopeChart)

declare global {
  interface HTMLElementTagNameMap {
    'uip-slope-chart': UipSlopeChart
  }
}
