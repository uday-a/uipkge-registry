import { ChartElement } from './lib/chart-element'
import { mergeOptionBlock } from './lib/chart-theme'

function median(vals: number[]) {
  const s = [...vals].sort((a, b) => a - b)
  const m = Math.floor(s.length / 2)
  return s.length % 2 ? s[m]! : ((s[m - 1] ?? 0) + (s[m] ?? 0)) / 2
}

/**
 * <uip-quadrant-chart> — the registry QuadrantChart (React `QuadrantChart`)
 * as a web component. Builds the same ECharts option as React for the same
 * props.
 *
 * Properties (React props): `data` ({ x, y, label? }[] via property / JSON
 * attribute), `x-mid` / `y-mid` (split lines; default to the data medians),
 * `quadrant-labels` (tuple via property / JSON attribute; clockwise from
 * top-right, default ['Stars', 'Question marks', 'Dogs', 'Cash cows']),
 * `x-name` / `y-name`, `height` (default 300), `option` (ECharts escape
 * hatch, merged like React), `aria-label` (React `ariaLabel`). React's
 * `className` → host classes.
 */
export class UipQuadrantChart extends ChartElement {
  static properties = {
    data: { type: Array },
    xMid: { attribute: 'x-mid', type: Number },
    yMid: { attribute: 'y-mid', type: Number },
    quadrantLabels: { attribute: 'quadrant-labels', type: Array },
    xName: { attribute: 'x-name' },
    yName: { attribute: 'y-name' },
    option: { type: Object },
  }

  data: { x: number; y: number; label?: string }[] = []
  xMid?: number
  yMid?: number
  quadrantLabels: [string, string, string, string] = ['Stars', 'Question marks', 'Dogs', 'Cash cows']
  xName?: string
  yName?: string
  option?: any
  protected readonly chartSlot = 'quadrant-chart'

  protected buildOption() {
    const theme = this.chartTheme
    const { xMid, yMid, quadrantLabels, xName, yName } = this
    const data = this.data ?? []
    const x = xMid ?? median(data.map((d) => d.x))
    const y = yMid ?? median(data.map((d) => d.y))
    const quad = (name: string, x0: number | string, x1: number | string, y0: number | string, y1: number | string) => [
      {
        xAxis: x0,
        yAxis: y0,
        itemStyle: { color: theme.colors[0], opacity: 0.05 },
        label: {
          show: true,
          position: 'inside',
          color: theme.textColor,
          fontSize: 12,
          fontWeight: 700,
          formatter: name,
        },
      },
      { xAxis: x1, yAxis: y1 },
    ]
    const series = [
      {
        type: 'scatter',
        symbolSize: 12,
        itemStyle: { color: theme.colors[0], opacity: 0.85 },
        label: {
          show: true,
          position: 'top',
          color: theme.textColor,
          fontSize: 10,
          formatter: (p: any) => p.value[2] ?? '',
        },
        markLine: {
          silent: true,
          symbol: 'none',
          lineStyle: { type: 'dashed', color: theme.textColor, opacity: 0.6 },
          label: { show: false },
          data: [{ xAxis: x }, { yAxis: y }],
        },
        markArea: {
          silent: true,
          data: [
            quad(quadrantLabels[0], x, 'max', y, 'max'),
            quad(quadrantLabels[1], 'min', x, y, 'max'),
            quad(quadrantLabels[2], 'min', x, 'min', y),
            quad(quadrantLabels[3], x, 'max', 'min', y),
          ],
        },
        data: data.map((d) => [d.x, d.y, d.label ?? '']),
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
    const xs = data.map((d) => d.x)
    const ys = data.map((d) => d.y)
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
      legend: { show: false },
      xAxis: mergeOptionBlock(
        {
          type: 'value',
          name: xName,
          min: Math.min(...xs) - 1,
          max: Math.max(...xs) + 1,
          nameTextStyle: { color: theme.textColor, fontSize: 10 },
          splitLine: { lineStyle: { color: theme.splitLineColor } },
          axisLabel: { color: theme.textColor, fontSize: 11 },
        },
        userXAxis,
      ),
      yAxis: mergeOptionBlock(
        {
          type: 'value',
          name: yName,
          min: Math.min(...ys) - 1,
          max: Math.max(...ys) + 1,
          nameTextStyle: { color: theme.textColor, fontSize: 10 },
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

customElements.get('uip-quadrant-chart') || customElements.define('uip-quadrant-chart', UipQuadrantChart)

declare global {
  interface HTMLElementTagNameMap {
    'uip-quadrant-chart': UipQuadrantChart
  }
}
