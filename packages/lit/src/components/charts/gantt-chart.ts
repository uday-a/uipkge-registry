import { ChartElement } from './lib/chart-element'
import { mergeOptionBlock } from './lib/chart-theme'

export interface GanttTask {
  name: string
  /** ISO date strings. */
  start: string
  end: string
  /** 0..1 fraction shaded darker as progress. */
  progress?: number
  group?: string
}

export interface GanttMilestone {
  /** Task name to pin the diamond to. */
  task: string
  /** ISO date string. */
  date: string
  label?: string
}

/**
 * <uip-gantt-chart> — the registry GanttChart (React `GanttChart`) as a web
 * component. Builds the same ECharts option as React for the same props
 * (custom-series bars with the same renderItem).
 *
 * Properties (React props): `tasks` ({ name, start, end, progress?, group? }[]),
 * `milestones` ({ task, date, label? }[]), `today` (ISO date for the dashed
 * line), `height` (default 320), `option` (ECharts escape hatch, merged like
 * React), `aria-label` (React `ariaLabel`). React's `className` → host
 * classes.
 */
export class UipGanttChart extends ChartElement {
  static properties = {
    tasks: { type: Array },
    milestones: { type: Array },
    today: {},
    option: { type: Object },
  }

  tasks: GanttTask[] = []
  milestones?: GanttMilestone[]
  today?: string
  option?: any
  height: number | string = 320
  protected readonly chartSlot = 'gantt-chart'

  protected buildOption() {
    const theme = this.chartTheme
    const { tasks, milestones, today, option } = this
    const rows = tasks ?? []
    const groups = [...new Set(rows.map((t) => t.group ?? 'default'))]
    const colorOf = (t: GanttTask) => theme.colors[groups.indexOf(t.group ?? 'default') % theme.colors.length]
    const series = [
      {
        type: 'custom',
        renderItem: (params: any, api: any) => {
          const i: number = params.dataIndex
          const t = rows[i]!
          const start = api.coord([api.value(0), i])
          const end = api.coord([api.value(1), i])
          const h = Math.max(8, api.size!([0, 1])[1] * 0.55)
          const p = Math.max(0, Math.min(1, t.progress ?? 1))
          return {
            type: 'group',
            children: [
              {
                type: 'rect',
                shape: { x: start[0], y: start[1] - h / 2, width: Math.max(2, end[0] - start[0]), height: h, r: 4 },
                style: { fill: colorOf(t), opacity: 0.3 },
              },
              {
                type: 'rect',
                shape: {
                  x: start[0],
                  y: start[1] - h / 2,
                  width: Math.max(2, (end[0] - start[0]) * p),
                  height: h,
                  r: 4,
                },
                style: { fill: colorOf(t) },
              },
            ],
          }
        },
        encode: { x: [0, 1], y: 2 },
        data: rows.map((t, i) => [t.start, t.end, i]),
        markPoint: milestones?.length
          ? {
              symbol: 'diamond',
              symbolSize: 13,
              itemStyle: { color: theme.colors[3], borderColor: theme.tooltipBg, borderWidth: 1.5 },
              label: {
                show: true,
                fontSize: 9,
                color: theme.textColor,
                formatter: '{b}',
                position: 'top',
                distance: 6,
              },
              data: milestones.map((m) => ({
                name: m.label ?? m.task,
                coord: [m.date, rows.findIndex((t) => t.name === m.task)],
              })),
            }
          : undefined,
        markLine: today
          ? {
              silent: true,
              symbol: 'none',
              lineStyle: { type: 'dashed', color: theme.textColor, width: 1 },
              label: { formatter: 'Today', color: theme.textColor, fontSize: 10, position: 'insideEndTop' },
              data: [{ xAxis: today }],
            }
          : undefined,
      },
    ]
    const userOption: any = option ?? {}
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
          formatter: (p: any) => {
            const t = rows[p.dataIndex]
            return `${t?.name}<br/>${String(t?.start).slice(0, 10)} → ${String(t?.end).slice(0, 10)}`
          },
        },
        userTooltip,
      ),
      legend: { show: false },
      xAxis: mergeOptionBlock(
        {
          type: 'time',
          splitLine: { lineStyle: { color: theme.splitLineColor } },
          axisLabel: { color: theme.textColor, fontSize: 11 },
        },
        userXAxis,
      ),
      yAxis: mergeOptionBlock(
        {
          type: 'category',
          inverse: true,
          data: rows.map((t) => t.name),
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

customElements.get('uip-gantt-chart') || customElements.define('uip-gantt-chart', UipGanttChart)

declare global {
  interface HTMLElementTagNameMap {
    'uip-gantt-chart': UipGanttChart
  }
}
