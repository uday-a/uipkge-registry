import { ChartElement } from './lib/chart-element'
import { toRgba } from './lib/chart-theme'

/**
 * <uip-sparkline> — the registry Sparkline (React `Sparkline`) as a web
 * component. Builds the same ECharts option as React for the same props.
 *
 * Properties (React props): `data` (number[]; JSON attribute or property),
 * `color`, `height` (default 40), `option` (ECharts escape hatch, merged like
 * React: `series[i]` spread onto the base series, other keys override),
 * `aria-label` (React `ariaLabel`). React's `className` → put classes on the host.
 */
export class UipSparkline extends ChartElement {
  static properties = {
    data: { type: Array },
    color: {},
    option: { type: Object },
  }

  data: number[] = []
  color?: string
  option?: any
  height: number | string = 40
  protected readonly chartSlot = 'sparkline'

  protected buildOption() {
    const data = this.data ?? []
    const color = this.color ?? this.chartTheme.colors[1]!
    const series = [
      {
        type: 'line',
        smooth: true,
        // Show a dot only at the last datapoint so the eye can find the
        // current value; intermediate dots clutter at sparkline density.
        showSymbol: false,
        showAllSymbol: false,
        symbol: 'circle',
        symbolSize: 5,
        endLabel: { show: false },
        lineStyle: { width: 1.75, color },
        itemStyle: { color, borderColor: color, borderWidth: 0 },
        data: data.map((v, i) => ({
          value: v,
          symbol: i === data.length - 1 ? 'circle' : 'none',
          symbolSize: i === data.length - 1 ? 5 : 0,
        })),
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: toRgba(color, 0.18) },
              { offset: 1, color: toRgba(color, 0) },
            ],
          },
        },
      },
    ]

    const userOption: any = this.option ?? {}
    const { series: userSeries, ...userRest } = userOption
    const mergedSeries = Array.isArray(userSeries)
      ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) }))
      : series

    return {
      grid: { left: 0, right: 0, top: 2, bottom: 2 },
      xAxis: { type: 'category', show: false, data: data.map((_, i) => i) },
      yAxis: { type: 'value', show: false, min: (value: any) => value.min * 0.9 },
      tooltip: { show: false },
      series: mergedSeries,
      ...userRest,
    }
  }
}

customElements.get('uip-sparkline') || customElements.define('uip-sparkline', UipSparkline)

declare global {
  interface HTMLElementTagNameMap {
    'uip-sparkline': UipSparkline
  }
}
