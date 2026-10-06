import { ChartElement } from './lib/chart-element'

export interface ParallelAxis {
  name: string
  /** Set explicitly for fixed scales, otherwise computed from data. */
  min?: number
  max?: number
}

export interface ParallelRow {
  /** One value per axis, in the same order as `axes`. */
  values: number[]
  /** Optional name shown in the tooltip. */
  name?: string
  /** Optional series grouping (index → chart-N colour). */
  group?: number
}

/**
 * <uip-parallel-chart> — the registry ParallelChart (React `ParallelChart`)
 * as a web component. Builds the same ECharts option as React for the same
 * props.
 *
 * Properties (React props): `axes` ({ name, min?, max? }[]), `data`
 * ({ values, name?, group? }[]), `groups` (group labels for the legend),
 * `height` (default 360), `option` (ECharts escape hatch, merged like React),
 * `aria-label` (React `ariaLabel`). React's `className` → host classes.
 */
export class UipParallelChart extends ChartElement {
  static properties = {
    axes: { type: Array },
    data: { type: Array },
    groups: { type: Array },
    option: { type: Object },
  }

  axes: ParallelAxis[] = []
  data: ParallelRow[] = []
  groups?: string[]
  option?: any
  height: number | string = 360
  protected readonly chartSlot = 'parallel-chart'

  protected buildOption() {
    const theme = this.chartTheme
    const { axes, data, groups, option } = this
    // Build one series per group so the legend can toggle them.
    const groupList = groups ?? ['series']
    const series = groupList.map((name, gi) => ({
      name,
      type: 'parallel' as const,
      lineStyle: { width: 1, opacity: 0.6 },
      data: (data ?? [])
        .filter((r) => (typeof r.group === 'number' ? r.group === gi : gi === 0))
        .map((r) => ({ value: r.values, name: r.name })),
    }))

    const userOption: any = option ?? {}
    const { series: userSeries, ...userRest } = userOption
    const mergedSeries = Array.isArray(userSeries) ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) })) : series

    return {
      color: theme.colors,
      tooltip: {
        trigger: 'item',
        backgroundColor: theme.tooltipBg,
        borderColor: theme.tooltipBorder,
        textStyle: { color: theme.tooltipText, fontSize: 12 },
      },
      legend: groups?.length
        ? {
            bottom: 0,
            icon: 'circle',
            itemWidth: 8,
            itemHeight: 8,
            textStyle: { fontSize: 11, color: theme.textColor },
          }
        : undefined,
      parallelAxis: (axes ?? []).map((a, dim) => ({
        dim,
        name: a.name,
        min: a.min,
        max: a.max,
        nameTextStyle: { fontSize: 11, color: theme.textColor },
        axisLine: { lineStyle: { color: theme.axisColor } },
        axisLabel: { color: theme.textColor, fontSize: 11 },
      })),
      parallel: {
        left: 36,
        right: 24,
        top: 36,
        bottom: groups?.length ? 36 : 24,
        parallelAxisDefault: { axisLine: { lineStyle: { color: theme.axisColor } } },
      },
      series: mergedSeries,
      ...userRest,
    }
  }
}

customElements.get('uip-parallel-chart') || customElements.define('uip-parallel-chart', UipParallelChart)

declare global {
  interface HTMLElementTagNameMap {
    'uip-parallel-chart': UipParallelChart
  }
}
