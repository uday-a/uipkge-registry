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
  getChartAxisColor,
  getChartColors,
  getChartTextColor,
  getChartTooltipBg,
  getChartTooltipBorder,
  getChartTooltipText,
} from '../use-chart-theme'

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
 * Angular port of the UIPKGE ParallelChart — high-dimensional rows as polylines. Standalone, theme-aware. Same inputs as the Vue `ParallelChart` (`axes`, `data`, `groups`, `height`, `option`).
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-parallel-chart, [ui-parallel-chart]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"parallel-chart"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
    '[attr.role]': '"img"',
    '[attr.aria-label]': 'ariaLabel || "Chart"',
    '[style.height]': 'heightStyle',
  },
  template: `<div #chartEl class="size-full"></div>`,
})
export class UiParallelChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() axes: ParallelAxis[] = []
  @Input() data: ParallelRow[] = []
  /** Optional group labels (shown in legend). */
  @Input() groups?: string[]
  @Input() height: number | string = 360
  @Input() option?: Record<string, unknown>
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  @Input() ariaLabel?: string
  @Input('class') className?: string

  @ViewChild('chartEl', { static: false }) chartEl?: ElementRef<HTMLDivElement>

  private chart: echarts.ECharts | null = null
  private unsubscribeTheme: (() => void) | null = null

  get hostClass(): string {
    return cn('block w-full', this.className)
  }

  get heightStyle(): string {
    return /^\d+$/.test(String(this.height)) ? `${this.height}px` : String(this.height)
  }

  /** Build the merged ECharts option (pure — no DOM needed, unit-testable). */
  getOption(): Record<string, unknown> {
    const colors = getChartColors()
    // Build one series per group so the legend can toggle them.
    const groupList = this.groups ?? ['series']
    const series = groupList.map((name, gi) => ({
      name,
      type: 'parallel',
      lineStyle: { width: 1, opacity: 0.6 },
      data: this.data
        .filter((r) => (typeof r.group === 'number' ? r.group === gi : gi === 0))
        .map((r) => ({ value: r.values, name: r.name })),
    }))
    const userOption: Record<string, any> = this.option ?? {}
    const { series: userSeries, ...userRest } = userOption
    const mergedSeries = Array.isArray(userSeries) ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) })) : series
    return {
      color: colors,
      tooltip: {
        trigger: 'item',
        backgroundColor: getChartTooltipBg(),
        borderColor: getChartTooltipBorder(),
        textStyle: { color: getChartTooltipText(), fontSize: 12 },
      },
      legend: this.groups?.length
        ? {
            bottom: 0,
            icon: 'circle',
            itemWidth: 8,
            itemHeight: 8,
            textStyle: { fontSize: 11, color: getChartTextColor() },
          }
        : undefined,
      parallelAxis: this.axes.map((a, dim) => ({
        dim,
        name: a.name,
        min: a.min,
        max: a.max,
        nameTextStyle: { fontSize: 11, color: getChartTextColor() },
        axisLine: { lineStyle: { color: getChartAxisColor() } },
        axisLabel: { color: getChartTextColor(), fontSize: 11 },
      })),
      parallel: {
        left: 36,
        right: 24,
        top: 36,
        bottom: this.groups?.length ? 36 : 24,
        parallelAxisDefault: { axisLine: { lineStyle: { color: getChartAxisColor() } } },
      },
      series: mergedSeries,
      ...userRest,
    }
  }

  async ngAfterViewInit(): Promise<void> {
    if (typeof window === 'undefined' || !this.chartEl?.nativeElement) return
    const [{ use }, { CanvasRenderer }, { ParallelChart: EChartsParallelChart }, comps] = await Promise.all([
      import('echarts/core'),
      import('echarts/renderers'),
      import('echarts/charts'),
      import('echarts/components'),
    ])
    use([CanvasRenderer, EChartsParallelChart, comps.ParallelComponent, comps.TooltipComponent, comps.LegendComponent])
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
    if (this.chart && (changes['data'] || changes['option'] || changes['axes'] || changes['groups'])) {
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
