import { ChartElement } from './lib/chart-element'
import { mergeOptionBlock } from './lib/chart-theme'

export interface BulletDatum {
  label: string
  /** Measured value (foreground bar). */
  actual: number
  /** Target marker position. */
  target: number
  /** [poor, satisfactory, good] upper bounds for the background bands. */
  ranges: [number, number, number]
}

/**
 * <uip-bullet-chart> — the registry BulletChart (React `BulletChart`) as a
 * web component. Builds the same ECharts option as React for the same props.
 *
 * Properties (React props): `data` (BulletDatum[]; JSON attribute or
 * property), `height` (default 300), `option` (ECharts escape hatch, merged
 * like React), `aria-label` (React `ariaLabel`). React's `className` → host
 * classes.
 */
export class UipBulletChart extends ChartElement {
  static properties = {
    data: { type: Array },
    option: { type: Object },
  }

  data: BulletDatum[] = []
  option?: any
  protected readonly chartSlot = 'bullet-chart'

  protected buildOption() {
    const theme = this.chartTheme
    const data = this.data ?? []
    const labels = data.map((d) => d.label)
    const series = [
      {
        name: 'poor',
        type: 'bar',
        stack: 'ranges',
        silent: true,
        barWidth: 18,
        itemStyle: { color: theme.splitLineColor },
        data: data.map((d) => d.ranges[0]),
      },
      {
        name: 'ok',
        type: 'bar',
        stack: 'ranges',
        silent: true,
        itemStyle: { color: theme.axisColor, opacity: 0.85 },
        data: data.map((d) => d.ranges[1] - d.ranges[0]),
      },
      {
        name: 'good',
        type: 'bar',
        stack: 'ranges',
        silent: true,
        itemStyle: { color: theme.colors[4], opacity: 0.35 },
        data: data.map((d) => d.ranges[2] - d.ranges[1]),
      },
      {
        name: 'actual',
        type: 'bar',
        barWidth: 7,
        barGap: '-90%',
        z: 3,
        itemStyle: { color: theme.colors[0], borderRadius: 3 },
        label: { show: true, position: 'right', color: theme.textColor, fontSize: 11 },
        data: data.map((d) => d.actual),
      },
      {
        name: 'target',
        type: 'scatter',
        z: 4,
        symbol: 'rect',
        symbolSize: [3, 24],
        itemStyle: { color: theme.textColor },
        data: data.map((d, i) => [d.target, i]),
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
      grid: mergeOptionBlock({ left: 16, right: 48, top: 16, bottom: 24, containLabel: true }, userGrid),
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
          type: 'value',
          splitLine: { lineStyle: { color: theme.splitLineColor } },
          axisLabel: { color: theme.textColor, fontSize: 11 },
        },
        userXAxis,
      ),
      yAxis: mergeOptionBlock(
        {
          type: 'category',
          inverse: true,
          data: labels,
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

customElements.get('uip-bullet-chart') || customElements.define('uip-bullet-chart', UipBulletChart)

declare global {
  interface HTMLElementTagNameMap {
    'uip-bullet-chart': UipBulletChart
  }
}
