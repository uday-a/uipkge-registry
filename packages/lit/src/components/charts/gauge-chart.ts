import { ChartElement } from './lib/chart-element'

/**
 * Static fallback stoplight: teal (safe) -> amber (warning) -> red (danger).
 * Verbatim from React's `gaugeThresholds` in useChartTheme. The element's
 * default is the theme's `semanticGaugeThresholds` (status tokens) instead.
 */
export const gaugeThresholds: [number, string][] = [
  [0.6, '#14b8a6'],
  [0.85, '#f59e0b'],
  [1, '#dc2626'],
]

/**
 * <uip-gauge-chart> — the registry GaugeChart (React `GaugeChart`) as a web
 * component. Builds the same ECharts option as React for the same props.
 *
 * Properties (React props): `value` (number), `min` (default 0), `max`
 * (default 100), `unit` (default ''), `label`, `height` (default 220),
 * `thresholds` ([fraction, color][]; property or JSON attribute; defaults to
 * the theme's success -> warning -> destructive tokens at 70% / 90%), `option` (ECharts escape hatch, merged like React),
 * `aria-label` (React `ariaLabel`). React's `className` → host classes.
 */
export class UipGaugeChart extends ChartElement {
  static properties = {
    value: { type: Number },
    min: { type: Number },
    max: { type: Number },
    unit: {},
    label: {},
    thresholds: { type: Array },
    option: { type: Object },
  }

  value = 0
  min = 0
  max = 100
  unit = ''
  label?: string
  thresholds?: [number, string][]
  option?: any
  protected readonly chartSlot = 'gauge-chart'

  constructor() {
    super()
    this.height = 220
  }

  protected buildOption() {
    const theme = this.chartTheme
    const { value, min, max, unit, label, thresholds } = this
    const series = [
      {
        type: 'gauge',
        min,
        max,
        center: ['50%', '60%'],
        radius: '85%',
        startAngle: 200,
        endAngle: -20,
        progress: { show: true, width: 14, itemStyle: { color: theme.colors[0] } },
        pointer: { show: true, length: '55%', width: 4, itemStyle: { color: theme.colors[0] } },
        axisLine: {
          lineStyle: {
            width: 14,
            color: (thresholds ?? theme.semanticGaugeThresholds).map(([stop, color]) => [stop, color] as [number, string]),
          },
        },
        axisTick: { distance: -22, length: 4, lineStyle: { color: theme.textColor, width: 1 } },
        splitLine: { distance: -26, length: 8, lineStyle: { color: theme.textColor, width: 2 } },
        axisLabel: { color: theme.textColor, fontSize: 11, distance: -34 },
        anchor: { show: false },
        title: {
          offsetCenter: [0, '88%'],
          color: theme.textColor,
          fontSize: 12,
          fontWeight: 500,
        },
        detail: {
          valueAnimation: true,
          formatter: `{value}${unit ? ' ' + unit : ''}`,
          color: theme.foregroundColor,
          fontSize: 28,
          fontWeight: 600,
          offsetCenter: [0, '40%'],
        },
        data: [{ value, name: label ?? '' }],
      },
    ]

    const userOption: any = this.option ?? {}
    const { series: userSeries, ...userRest } = userOption
    const mergedSeries = Array.isArray(userSeries) ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) })) : series

    return {
      tooltip: {
        formatter: '{b}: {c}' + (unit ? ` ${unit}` : ''),
        backgroundColor: theme.tooltipBg,
        borderColor: theme.tooltipBorder,
        textStyle: { color: theme.tooltipText, fontSize: 12 },
      },
      series: mergedSeries,
      ...userRest,
    }
  }
}

customElements.get('uip-gauge-chart') || customElements.define('uip-gauge-chart', UipGaugeChart)

declare global {
  interface HTMLElementTagNameMap {
    'uip-gauge-chart': UipGaugeChart
  }
}
