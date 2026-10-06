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
  getChartSplitLineColor,
  getChartTextColor,
  getChartTooltipBg,
  getChartTooltipBorder,
  getChartTooltipText,
} from '../use-chart-theme'

/**
 * Angular port of the UIPKGE CalendarHeatmap — GitHub-style contribution grid on the ECharts calendar coordinate system. Standalone, theme-aware. Same inputs as the React/Vue `CalendarHeatmap` (`data`, `range`, `colorRange`, `height`, `option`).
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-calendar-heatmap, [ui-calendar-heatmap]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"calendar-heatmap"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
    '[attr.role]': '"img"',
    '[attr.aria-label]': 'ariaLabel || "Chart"',
    '[attr.tabindex]': '0',
    '[style.height]': 'heightStyle',
  },
  template: `<div #chartEl class="size-full"></div>`,
})
export class UiCalendarHeatmapComponent implements AfterViewInit, OnChanges, OnDestroy {
  /** `[date-string, count]` tuples. */
  @Input() data: [string, number][] = []
  /** Calendar range: a year ('2024') or an explicit [start, end] pair. Defaults to the year of the first datum. */
  @Input() range?: string | [string, string]
  /** @deprecated Use `range` instead. Kept as a fallback: `range ?? year ?? first-datum year`. */
  @Input() year?: string
  /** [low, high] ramp. Defaults to chart-1 → chart-4. */
  @Input() colorRange?: [string, string]
  @Input() height: number | string = 200
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
  resolvedYear(): string {
    if (typeof this.range === 'string') return this.range
    if (Array.isArray(this.range)) return this.range[0]!.slice(0, 4)
    return this.year ?? this.data[0]?.[0]?.slice(0, 4) ?? String(new Date().getFullYear())
  }

  resolvedRange(): string | [string, string] {
    return this.range ?? this.resolvedYear()
  }

  maxCount(): number {
    return this.data.reduce((m, [, v]) => Math.max(m, v), 0) || 1
  }

  /** Build the merged ECharts option (pure — no DOM needed, unit-testable). */
  getOption(): Record<string, unknown> {
    const colors = getChartColors()
    const ramp = this.colorRange ?? [colors[0]!, colors[3]!]
    const series = [{ type: 'heatmap', coordinateSystem: 'calendar', data: this.data }]
    const userOption: Record<string, any> = this.option ?? {}
    const {
      series: userSeries,
      tooltip: userTooltip,
      visualMap: userVisualMap,
      calendar: userCalendar,
      ...userRest
    } = userOption
    const mergedSeries = Array.isArray(userSeries) ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) })) : series
    return {
      color: colors,
      tooltip: {
        position: 'top',
        formatter: (p: any) => `<strong>${p.value[0]}</strong><br>${p.value[1]} contributions`,
        backgroundColor: getChartTooltipBg(),
        borderColor: getChartTooltipBorder(),
        textStyle: { color: getChartTooltipText(), fontSize: 12 },
        ...(typeof userTooltip === 'object' && userTooltip !== null ? userTooltip : {}),
      },
      visualMap: {
        show: false,
        min: 0,
        max: this.maxCount(),
        inRange: { color: ramp },
        ...(typeof userVisualMap === 'object' && userVisualMap !== null ? userVisualMap : {}),
      },
      calendar: {
        top: 24,
        left: 36,
        right: 12,
        cellSize: ['auto', 14],
        range: this.resolvedRange(),
        itemStyle: { color: getChartSplitLineColor(), borderWidth: 0 },
        splitLine: { show: false },
        dayLabel: {
          color: getChartTextColor(),
          fontSize: 10,
          firstDay: 1,
          nameMap: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
        },
        monthLabel: { color: getChartTextColor(), fontSize: 10, fontWeight: 600 },
        yearLabel: { show: false },
        ...(typeof userCalendar === 'object' && userCalendar !== null ? userCalendar : {}),
      },
      series: mergedSeries,
      ...userRest,
    }
  }

  async ngAfterViewInit(): Promise<void> {
    if (typeof window === 'undefined' || !this.chartEl?.nativeElement) return
    const [{ use }, { CanvasRenderer }, { HeatmapChart: EChartsHeatmapChart }, comps] = await Promise.all([
      import('echarts/core'),
      import('echarts/renderers'),
      import('echarts/charts'),
      import('echarts/components'),
    ])
    use([
      CanvasRenderer,
      EChartsHeatmapChart,
      comps.CalendarComponent,
      comps.VisualMapComponent,
      comps.TooltipComponent,
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
    if (
      this.chart &&
      (changes['data'] || changes['option'] || changes['range'] || changes['year'] || changes['colorRange'])
    ) {
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
