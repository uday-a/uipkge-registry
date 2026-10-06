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
  getChartTooltipBg,
  getChartTooltipBorder,
  getChartTooltipText,
  gaugeThresholds,
  mergeOptionBlock,
} from '../use-chart-theme'

/**
 * Angular port of the UIPKGE GaugeChart — single-value dial with
 * progress arc and animated detail readout. Standalone, theme-aware.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-gauge-chart, [ui-gauge-chart]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"gauge-chart"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
    '[attr.role]': '"img"',
    '[attr.aria-label]': 'ariaLabel || "Chart"',
    '[attr.tabindex]': '0',
    '[style.height]': 'heightStyle',
  },
  template: `<div #chartEl class="size-full"></div>`,
})
export class UiGaugeChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  /** Current value. Default 0. */
  @Input() value = 0
  /** Scale minimum. Default 0. */
  @Input() min = 0
  /** Scale maximum. Default 100. */
  @Input() max = 100
  /** Dial label. Default 'Score'. */
  @Input() name = 'Score'
  /** Show progress arc. Default true. */
  @Input() progress = true
  /** Unit suffix for the detail readout. Default ''. */
  @Input() unit = ''
  /** Dial label, like React/Vue (`data[0].name`); falls back to `name` when unset. */
  @Input() label?: string
  /** Colour stops as [percentage, hex] pairs. Defaults to the shared gaugeThresholds. */
  @Input() thresholds: [number, string][] = gaugeThresholds
  @Input() height: number | string = 220
  @Input() option?: Record<string, unknown>
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  @Input() ariaLabel?: string
  @Input('class') className?: string

  ratio(): number {
    if (this.max <= this.min) return 0
    return Math.min(1, Math.max(0, (this.value - this.min) / (this.max - this.min)))
  }
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
    const userOption: Record<string, any> = this.option ?? {}
    const { series: userSeries, ...userRest } = userOption
    return {
      series: Array.isArray(userSeries)
        ? userSeries
        : [
            {
              type: 'gauge',
              min: this.min,
              max: this.max,
              progress: { show: this.progress, width: 12 },
              axisLine: {
                lineStyle: { width: 12, color: this.thresholds.map(([stop, color]) => [stop, color]) },
              },
              axisTick: { show: false },
              splitLine: { show: false },
              axisLabel: { color: getChartTextColor(), fontSize: 11 },
              pointer: { show: false },
              detail: {
                valueAnimation: true,
                fontSize: 28,
                fontWeight: 700,
                color: getChartTextColor(),
                formatter: `{value}${this.unit ? ' ' + this.unit : ''}`,
              },
              title: { color: getChartTextColor(), fontSize: 12 },
              data: [{ value: this.value, name: this.label ?? this.name }],
            },
          ],
      ...userRest,
    }
  }

  /** ECharts chart + component modules, resolved lazily so SSR never loads canvas code. */
  private chartModules(charts: Record<string, unknown>, comps: Record<string, unknown>): unknown[] {
    return [charts['GaugeChart'], comps['TitleComponent']]
  }

  async ngAfterViewInit(): Promise<void> {
    if (typeof window === 'undefined' || !this.chartEl?.nativeElement) return
    const [{ use }, { CanvasRenderer }, charts, comps] = await Promise.all([
      import('echarts/core'),
      import('echarts/renderers'),
      import('echarts/charts'),
      import('echarts/components'),
    ])
    use([CanvasRenderer, ...(this.chartModules(charts, comps) as never[])])
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
    if (this.chart && Object.keys(changes).length) {
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
