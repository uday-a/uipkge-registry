import { ChartElement } from './lib/chart-element'
import { mergeOptionBlock } from './lib/chart-theme'

export interface LollipopRow {
  category: string
  value: number
}

/**
 * <uip-lollipop-chart> — the registry LollipopChart (React `LollipopChart`)
 * as a web component. Builds the same ECharts option as React for the same
 * props.
 *
 * Properties (React props): `data` ({ category, value }[]; JSON attribute or
 * property), `height` (default 300), `option` (ECharts escape hatch, merged
 * like React), `aria-label` (React `ariaLabel`). React's `className` → host
 * classes.
 */
export class UipLollipopChart extends ChartElement {
  static properties = {
    data: { type: Array },
    option: { type: Object },
  }

  data: LollipopRow[] = []
  option?: any
  protected readonly chartSlot = 'lollipop-chart'

  protected buildOption() {
    const theme = this.chartTheme
    const data = this.data ?? []
    const cats = data.map((d) => d.category)
    const vals = data.map((d) => d.value)
    const series = [
      { name: 'stem', type: 'bar', barWidth: 3, silent: true, itemStyle: { color: theme.axisColor }, data: vals },
      {
        name: 'value',
        type: 'scatter',
        symbolSize: 14,
        itemStyle: { color: theme.colors[0] },
        label: { show: true, position: 'top', color: theme.textColor, fontSize: 11 },
        data: vals.map((v, i) => [cats[i], v]),
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
    const mergedSeries = Array.isArray(userSeries)
      ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) }))
      : series
    return {
      color: theme.colors,
      grid: mergeOptionBlock({ left: 16, right: 16, top: 32, bottom: 24, containLabel: true }, userGrid),
      tooltip: mergeOptionBlock(
        {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
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
          data: cats,
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

customElements.get('uip-lollipop-chart') || customElements.define('uip-lollipop-chart', UipLollipopChart)

declare global {
  interface HTMLElementTagNameMap {
    'uip-lollipop-chart': UipLollipopChart
  }
}
