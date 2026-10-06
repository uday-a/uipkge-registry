import { ChartElement } from './lib/chart-element'
import { mergeOptionBlock } from './lib/chart-theme'

export interface PyramidRow {
  band: string
  left: number
  right: number
}

/**
 * <uip-population-pyramid-chart> — the registry PopulationPyramidChart (React
 * `PopulationPyramidChart`) as a web component. Builds the same ECharts
 * option as React for the same props.
 *
 * Properties (React props): `data` ({ band, left, right }[]; JSON attribute
 * or property), `names` ([left, right] tuple; default ['Male', 'Female']),
 * `height` (default 340), `option` (ECharts escape hatch, merged like React),
 * `aria-label` (React `ariaLabel`). React's `className` → host classes.
 */
export class UipPopulationPyramidChart extends ChartElement {
  static properties = {
    data: { type: Array },
    names: { type: Array },
    option: { type: Object },
  }

  data: PyramidRow[] = []
  names: [string, string] = ['Male', 'Female']
  option?: any
  height: number | string = 340
  protected readonly chartSlot = 'population-pyramid-chart'

  protected buildOption() {
    const theme = this.chartTheme
    const data = this.data ?? []
    const names = this.names ?? ['Male', 'Female']
    const series = [
      {
        name: names[0],
        type: 'bar',
        stack: 'pop',
        barWidth: 14,
        itemStyle: { color: theme.colors[2], borderRadius: [4, 4, 4, 4] },
        label: {
          show: true,
          position: 'left',
          color: theme.textColor,
          fontSize: 10,
          formatter: (p: any) => Math.abs(p.value),
        },
        data: data.map((d) => -Math.abs(d.left)),
      },
      {
        name: names[1],
        type: 'bar',
        stack: 'pop',
        barWidth: 14,
        itemStyle: { color: theme.colors[0], borderRadius: [4, 4, 4, 4] },
        label: { show: true, position: 'right', color: theme.textColor, fontSize: 10 },
        data: data.map((d) => Math.abs(d.right)),
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
    const mergedSeries = Array.isArray(userSeries)
      ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) }))
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
          valueFormatter: (v: any) => Math.abs(v),
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
          type: 'value',
          splitLine: { lineStyle: { color: theme.splitLineColor } },
          axisLabel: { color: theme.textColor, fontSize: 11, formatter: (v: number) => Math.abs(v) },
        },
        userXAxis,
      ),
      yAxis: mergeOptionBlock(
        {
          type: 'category',
          inverse: true,
          data: data.map((d) => d.band),
          axisLine: { lineStyle: { color: theme.axisColor } },
          axisLabel: { color: theme.textColor, fontSize: 11 },
          axisTick: { show: false },
        },
        userYAxis,
      ),
      series: mergedSeries,
      ...userRest,
    }
  }
}

customElements.get('uip-population-pyramid-chart') ||
  customElements.define('uip-population-pyramid-chart', UipPopulationPyramidChart)

declare global {
  interface HTMLElementTagNameMap {
    'uip-population-pyramid-chart': UipPopulationPyramidChart
  }
}
