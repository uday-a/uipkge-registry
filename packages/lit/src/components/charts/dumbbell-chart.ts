import { ChartElement } from './lib/chart-element'
import { mergeOptionBlock } from './lib/chart-theme'

export interface DumbbellRow {
  label: string
  a: number
  b: number
}

/**
 * <uip-dumbbell-chart> — the registry DumbbellChart (React `DumbbellChart`)
 * as a web component. Builds the same ECharts option as React for the same
 * props.
 *
 * Properties (React props): `data` ({ label, a, b }[]; JSON attribute or
 * property), `names` ([a, b] tuple; default ['Before', 'After']), `height`
 * (default 300), `option` (ECharts escape hatch, merged like React),
 * `aria-label` (React `ariaLabel`). React's `className` → host classes.
 */
export class UipDumbbellChart extends ChartElement {
  static properties = {
    data: { type: Array },
    names: { type: Array },
    option: { type: Object },
  }

  data: DumbbellRow[] = []
  names: [string, string] = ['Before', 'After']
  option?: any
  protected readonly chartSlot = 'dumbbell-chart'

  protected buildOption() {
    const theme = this.chartTheme
    const colorA = theme.colors[2]
    const colorB = theme.colors[0]
    const axisColor = theme.axisColor
    const rows = this.data ?? []
    const names = this.names ?? ['Before', 'After']
    const series = [
      {
        type: 'custom',
        renderItem: (params: any, api: any) => {
          const y = api.coord([0, params.dataIndex])[1]
          const a = api.coord([api.value(0), params.dataIndex])
          const b = api.coord([api.value(1), params.dataIndex])
          return {
            type: 'group',
            children: [
              {
                type: 'line',
                shape: { x1: a[0], y1: y, x2: b[0], y2: y },
                style: { stroke: axisColor, lineWidth: 2 },
              },
              { type: 'circle', shape: { cx: a[0], cy: y, r: 6 }, style: { fill: colorA } },
              { type: 'circle', shape: { cx: b[0], cy: y, r: 6 }, style: { fill: colorB } },
            ],
          }
        },
        data: rows.map((d) => [d.a, d.b]),
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
          trigger: 'item',
          backgroundColor: theme.tooltipBg,
          borderColor: theme.tooltipBorder,
          textStyle: { color: theme.tooltipText, fontSize: 12 },
          formatter: (p: any) =>
            `${rows[p.dataIndex]?.label}<br/>${names[0]}: ${p.value[0]}<br/>${names[1]}: ${p.value[1]}`,
        },
        userTooltip,
      ),
      legend: {
        bottom: 0,
        icon: 'circle',
        itemWidth: 8,
        itemHeight: 8,
        textStyle: { fontSize: 11, color: theme.textColor },
        data: [
          { name: names[0], itemStyle: { color: colorA } },
          { name: names[1], itemStyle: { color: colorB } },
        ],
      },
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
          data: rows.map((d) => d.label),
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

customElements.get('uip-dumbbell-chart') || customElements.define('uip-dumbbell-chart', UipDumbbellChart)

declare global {
  interface HTMLElementTagNameMap {
    'uip-dumbbell-chart': UipDumbbellChart
  }
}
