import { ChartElement } from './lib/chart-element'

/** `range="2026"` from markup, `range='["a","b"]'` as JSON or from JS as a tuple. */
const stringOrTuple = {
  fromAttribute: (v: string | null) => (v?.trim().startsWith('[') ? (JSON.parse(v) as [string, string]) : v),
}

/**
 * <uip-calendar-heatmap> — the registry CalendarHeatmap (React
 * `CalendarHeatmap`) as a web component. Builds the same ECharts option as
 * React for the same props.
 *
 * Properties (React props): `data` ([date, value][]; property or JSON
 * attribute), `range` (string or [start, end] tuple), `color-range` ([from,
 * to] cell ramp), `height` (default 200), `option` (ECharts escape hatch,
 * merged like React), `aria-label` (React `ariaLabel`). React's `className` →
 * host classes.
 */
export class UipCalendarHeatmap extends ChartElement {
  static properties = {
    data: { type: Array },
    range: { converter: stringOrTuple },
    colorRange: { attribute: 'color-range', type: Array },
    option: { type: Object },
  }

  data: [string, number][] = []
  range: string | [string, string] = ''
  colorRange?: [string, string]
  option?: any
  height: number | string = 200
  protected readonly chartSlot = 'calendar-heatmap'

  protected buildOption() {
    const theme = this.chartTheme
    const { data, range, option } = this
    const resolvedColorRange = this.colorRange ?? [theme.colors[0]!, theme.colors[3]!]
    const maxValue = (data ?? []).reduce((m, [, v]) => Math.max(m, v), 0) || 1

    return {
      color: theme.colors,
      tooltip: {
        position: 'top',
        formatter: (p: any) => `<strong>${p.value[0]}</strong><br>${p.value[1]} contributions`,
        backgroundColor: theme.tooltipBg,
        borderColor: theme.tooltipBorder,
        textStyle: { color: theme.tooltipText, fontSize: 12 },
      },
      visualMap: {
        show: false,
        min: 0,
        max: maxValue,
        inRange: { color: resolvedColorRange },
      },
      calendar: {
        top: 24,
        left: 36,
        right: 12,
        cellSize: ['auto', 14],
        range,
        itemStyle: { color: theme.splitLineColor, borderWidth: 0 },
        splitLine: { show: false },
        dayLabel: {
          color: theme.textColor,
          fontSize: 11,
          firstDay: 1,
          nameMap: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
        },
        monthLabel: { color: theme.textColor, fontSize: 11, fontWeight: 500 },
        yearLabel: { show: false },
      },
      series: (() => {
        const series = [{ type: 'heatmap', coordinateSystem: 'calendar', data }]
        const userSeries = (option as any)?.series
        return Array.isArray(userSeries) ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) })) : series
      })(),
      // Strip `series` from the rest spread so the merge above isn't clobbered.
      ...(() => {
        const { series: _, ...rest } = (option as any) ?? {}
        return rest
      })(),
    }
  }
}

customElements.get('uip-calendar-heatmap') || customElements.define('uip-calendar-heatmap', UipCalendarHeatmap)

declare global {
  interface HTMLElementTagNameMap {
    'uip-calendar-heatmap': UipCalendarHeatmap
  }
}
