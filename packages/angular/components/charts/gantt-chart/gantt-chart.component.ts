import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
  ChangeDetectionStrategy,
} from '@angular/core'
import type * as echarts from 'echarts/core'
import { cn } from '@/lib/utils'
import {
  getChartColors,
  getChartTextColor,
  getChartAxisColor,
  getChartSplitLineColor,
  getChartTooltipBg,
  getChartTooltipBorder,
  getChartTooltipText,
  mergeOptionBlock,
} from '../use-chart-theme'

/**
 * Angular port of the UIPKGE GanttChart — date-range bars with progress shading on a time axis,
 * diamond milestone markers and an optional dashed today line. Standalone, theme-aware.
 * Same inputs as the Vue `GanttChart` (`tasks`, `milestones`, `today`, `height`, `option`);
 * the task display field is `label` here (React/Vue use `name`).
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-gantt-chart, [ui-gantt-chart]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"gantt-chart"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
    '[attr.role]': '"img"',
    '[attr.aria-label]': 'ariaLabel || "Chart"',
    '[attr.tabindex]': '0',
    '[style.height]': 'heightStyle',
  },
  template: `<div #chartEl class="size-full"></div>`,
})
export class UiGanttChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  /** `{ label, start, end, progress?, group? }` per task. Dates parse via Date. */
  @Input() tasks: { label: string; start: string | number; end: string | number; progress?: number; group?: string }[] =
    []
  /** Diamond markers pinned to tasks (`task` matches the task `label`). */
  @Input() milestones: { task: string; date: string; label?: string }[] = []
  /** ISO date for a dashed "today" line. Pass explicitly (no implicit now() so SSR stays deterministic). */
  @Input() today?: string
  @Input() height: number | string = 320
  @Input() option?: Record<string, unknown>
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  @Input() ariaLabel?: string
  @Input('class') className?: string

  @ViewChild('chartEl', { static: false }) chartEl?: ElementRef<HTMLDivElement>

  private chart: echarts.ECharts | null = null
  private unsubscribeTheme: (() => void) | null = null

  get hostClass(): string {
    return cn('block focus-visible:ring-ring w-full focus-visible:ring-2 focus-visible:outline-none', this.className)
  }

  get heightStyle(): string {
    return /^\d+$/.test(String(this.height)) ? `${this.height}px` : String(this.height)
  }

  /** Build the merged ECharts option (pure — no DOM needed, unit-testable). */
  getOption(): Record<string, unknown> {
    const colors = getChartColors()
    const groups = [...new Set(this.tasks.map((t) => t.group ?? 'default'))]
    const colorOf = (t: { group?: string }): string => colors[groups.indexOf(t.group ?? 'default') % colors.length]!
    const series = [
      {
        type: 'custom',
        renderItem: (
          params: { dataIndex: number },
          api: { coord: (p: number[]) => number[]; value: (i: number) => number; size?: (p: number[]) => number[] },
        ) => {
          const t = this.tasks[params.dataIndex]!
          const start = api.coord([api.value(0), params.dataIndex])
          const end = api.coord([api.value(1), params.dataIndex])
          const h = Math.max(8, ((api.size?.([0, 1]) ?? [0, 14])[1] ?? 14) * 0.55)
          const p = Math.max(0, Math.min(1, t.progress ?? 1))
          const w = Math.max(2, end[0]! - start[0]!)
          return {
            type: 'group',
            children: [
              {
                type: 'rect',
                shape: { x: start[0], y: start[1]! - h / 2, width: w, height: h, r: 4 },
                style: { fill: colorOf(t), opacity: 0.3 },
              },
              {
                type: 'rect',
                shape: { x: start[0], y: start[1]! - h / 2, width: w * p, height: h, r: 4 },
                style: { fill: colorOf(t) },
              },
            ],
          }
        },
        data: this.tasks.map((t) => [+new Date(t.start), +new Date(t.end)]),
        markPoint: this.milestones.length
          ? {
              symbol: 'diamond',
              symbolSize: 13,
              itemStyle: { color: colors[3], borderColor: getChartTooltipBg(), borderWidth: 1.5 },
              label: {
                show: true,
                fontSize: 9,
                color: getChartTextColor(),
                formatter: '{b}',
                position: 'top',
                distance: 6,
              },
              data: this.milestones.map((m) => ({
                name: m.label ?? m.task,
                coord: [m.date, this.tasks.findIndex((t) => t.label === m.task)],
              })),
            }
          : undefined,
        markLine: this.today
          ? {
              silent: true,
              symbol: 'none',
              lineStyle: { type: 'dashed', color: getChartTextColor(), width: 1 },
              label: { formatter: 'Today', color: getChartTextColor(), fontSize: 10, position: 'insideEndTop' },
              data: [{ xAxis: this.today }],
            }
          : undefined,
      },
    ]
    const userOption: Record<string, any> = this.option ?? {}
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
      color: colors,
      grid: mergeOptionBlock(
        { left: 16, right: 16, top: 24, bottom: 24, outerBoundsMode: 'same', outerBoundsContain: 'axisLabel' },
        userGrid,
      ),
      tooltip: mergeOptionBlock(
        {
          trigger: 'item',
          backgroundColor: getChartTooltipBg(),
          borderColor: getChartTooltipBorder(),
          textStyle: { color: getChartTooltipText(), fontSize: 12 },
          formatter: (p: { dataIndex: number }) => {
            const t = this.tasks[p.dataIndex]
            return `${t?.label}<br/>${String(t?.start).slice(0, 10)} → ${String(t?.end).slice(0, 10)}`
          },
        },
        userTooltip,
      ),
      xAxis: mergeOptionBlock(
        {
          type: 'time',
          axisLabel: { color: getChartTextColor(), fontSize: 11 },
          splitLine: { lineStyle: { color: getChartSplitLineColor() } },
        },
        userXAxis,
      ),
      yAxis: mergeOptionBlock(
        {
          type: 'category',
          data: this.tasks.map((t) => t.label),
          inverse: true,
          axisLine: { lineStyle: { color: getChartAxisColor() } },
          axisLabel: { color: getChartTextColor(), fontSize: 11 },
          axisTick: { show: false },
        },
        userYAxis,
      ),
      series: mergedSeries,
      ...userRest,
    }
  }

  async ngAfterViewInit(): Promise<void> {
    if (typeof window === 'undefined' || !this.chartEl?.nativeElement) return
    const [{ use }, { CanvasRenderer }, { CustomChart: EChartsCustomChart }, comps] = await Promise.all([
      import('echarts/core'),
      import('echarts/renderers'),
      import('echarts/charts'),
      import('echarts/components'),
    ])
    use([
      CanvasRenderer,
      EChartsCustomChart,
      comps.GridComponent,
      comps.TooltipComponent,
      comps.MarkPointComponent,
      comps.MarkLineComponent,
    ])
    const { init } = await import('echarts/core')
    this.chart = init(this.chartEl.nativeElement)
    this.chart.setOption(this.getOption())
    const { onChartThemeChange } = await import('../use-chart-theme')
    this.unsubscribeTheme = onChartThemeChange(() => this.chart?.setOption(this.getOption()))
    if (typeof ResizeObserver !== 'undefined') {
      new ResizeObserver(() => this.chart?.resize()).observe(this.chartEl.nativeElement)
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.chart && (changes['data'] || changes['option'] || changes['tasks'])) {
      this.chart.setOption(this.getOption())
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeTheme?.()
    this.unsubscribeTheme = null
    try {
      this.chart?.dispose()
    } catch {
      /* already disposed */
    }
    this.chart = null
  }
}
