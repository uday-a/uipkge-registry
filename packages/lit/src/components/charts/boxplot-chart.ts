import { ChartElement } from './lib/chart-element'
import { mergeOptionBlock } from './lib/chart-theme'

export interface BoxRow {
  category: string
  /** [min, Q1, median, Q3, max] */
  values: [number, number, number, number, number]
}

/**
 * <uip-boxplot-chart> — the registry BoxplotChart (React `BoxplotChart`) as a
 * web component. Builds the same ECharts option as React for the same props.
 *
 * Properties (React props): `data` ({ category, values }[]; property or JSON
 * attribute), `horizontal` (boolean), `height` (default 320), `option`
 * (ECharts escape hatch, merged like React), `aria-label` (React `ariaLabel`).
 * React's `className` → host classes.
 */
export class UipBoxplotChart extends ChartElement {
  static properties = {
    data: { type: Array },
    horizontal: { type: Boolean },
    option: { type: Object },
  }

  data: BoxRow[] = []
  horizontal = false
  option?: any
  height: number | string = 320
  protected readonly chartSlot = 'boxplot-chart'

  protected buildOption() {
    const theme = this.chartTheme
    const data = this.data ?? []
    const cats = data.map((d) => d.category)
    const values = data.map((d) => d.values)

    const valueAxis = {
      type: 'value' as const,
      scale: true,
      splitLine: { lineStyle: { color: theme.splitLineColor } },
      axisLabel: { color: theme.textColor, fontSize: 11 },
      axisLine: { lineStyle: { color: theme.axisColor } },
      axisTick: { show: false },
    }
    const catAxis = {
      type: 'category' as const,
      data: cats,
      axisLine: { lineStyle: { color: theme.axisColor } },
      axisLabel: { color: theme.textColor, fontSize: 11 },
      axisTick: { show: false },
    }

    const series = [
      {
        type: 'boxplot',
        data: values,
        itemStyle: { color: theme.colors[0], borderColor: theme.colors[1] },
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
          trigger: 'item',
          backgroundColor: theme.tooltipBg,
          borderColor: theme.tooltipBorder,
          textStyle: { color: theme.tooltipText, fontSize: 12 },
        },
        userTooltip,
      ),
      xAxis: mergeOptionBlock(this.horizontal ? valueAxis : catAxis, userXAxis),
      yAxis: mergeOptionBlock(this.horizontal ? catAxis : valueAxis, userYAxis),
      series: mergedSeries,
      ...userRest,
    }
  }
}

customElements.get('uip-boxplot-chart') || customElements.define('uip-boxplot-chart', UipBoxplotChart)

declare global {
  interface HTMLElementTagNameMap {
    'uip-boxplot-chart': UipBoxplotChart
  }
}
