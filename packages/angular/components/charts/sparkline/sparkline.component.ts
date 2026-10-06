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
import { getChartColors, toRgba } from '../use-chart-theme'

/**
 * Angular port of the UIPKGE Sparkline — inline micro-chart for KPI tiles.
 * Standalone ECharts wrapper (line + bar registered so consumers can swap
 * `type: 'bar'` via the option escape hatch). Theme-aware via registry tokens.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-sparkline, [ui-sparkline]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"sparkline"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
    '[attr.role]': '"img"',
    '[attr.aria-label]': 'ariaLabel || "Chart"',
    '[attr.tabindex]': '0',
    '[style.height]': 'heightStyle',
  },
  template: `<div #chartEl class="size-full"></div>`,
})
export class UiSparklineComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() data: number[] = []
  @Input() color?: string
  @Input() height: number | string = 40
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

  resolveColor(): string {
    return this.color ?? getChartColors()[1]!
  }

  /** Build the merged ECharts option (pure — no DOM needed, unit-testable). */
  getOption(): Record<string, unknown> {
    const color = this.resolveColor()
    const series = [
      {
        type: 'line',
        smooth: true,
        showSymbol: false,
        showAllSymbol: false,
        symbol: 'circle',
        symbolSize: 5,
        endLabel: { show: false },
        lineStyle: { width: 1.75, color },
        itemStyle: { color, borderColor: color, borderWidth: 0 },
        // A dot only at the latest point so the eye finds the current value.
        data: this.data.map((v, i) => ({
          value: v,
          symbol: i === this.data.length - 1 ? 'circle' : 'none',
          symbolSize: i === this.data.length - 1 ? 5 : 0,
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
    const userOption: Record<string, any> = this.option ?? {}
    const { series: userSeries, ...userRest } = userOption
    const mergedSeries = Array.isArray(userSeries) ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) })) : series
    return {
      grid: { left: 0, right: 0, top: 2, bottom: 2 },
      xAxis: { type: 'category', show: false, data: this.data.map((_, i) => i) },
      yAxis: { type: 'value', show: false, min: (value: { min: number }) => value.min * 0.9 },
      tooltip: { show: false },
      series: mergedSeries,
      ...userRest,
    }
  }

  async ngAfterViewInit(): Promise<void> {
    if (typeof window === 'undefined' || !this.chartEl?.nativeElement) return
    const [{ use }, { CanvasRenderer }, { LineChart, BarChart }, { GridComponent, TooltipComponent }] =
      await Promise.all([
        import('echarts/core'),
        import('echarts/renderers'),
        import('echarts/charts'),
        import('echarts/components'),
      ])
    use([CanvasRenderer, LineChart, BarChart, GridComponent, TooltipComponent])
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
    if (this.chart && (changes['data'] || changes['option'] || changes['color'])) {
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
