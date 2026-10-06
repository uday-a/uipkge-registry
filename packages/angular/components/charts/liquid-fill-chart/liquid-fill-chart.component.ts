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
  toRgba,
} from '../use-chart-theme'

/**
 * Angular port of the UIPKGE LiquidFillChart. The Vue source renders dependency-free SVG waves; this standalone port keeps the identical inputs (`value`, `height`, `color`, `showLabel`, `unit`, plus an ECharts `option` escape hatch) and encodes the same fill level in a pure getOption() progress gauge.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-liquid-fill-chart, [ui-liquid-fill-chart]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"liquid-fill-chart"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
    '[attr.role]': '"img"',
    '[attr.aria-label]': 'resolvedAriaLabel',
    '[attr.tabindex]': '0',
    '[style.height]': 'heightStyle',
  },
  template: `<div #chartEl class="size-full"></div>`,
})
export class UiLiquidFillChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  /** Fill 0..100. */
  @Input() value = 0
  @Input() height: number | string = 220
  /** Wave colour. Defaults to chart-1 token. */
  @Input() color = 'var(--chart-1)'
  /** Show the % label in the centre. Default true. */
  @Input() showLabel = true
  @Input() unit = '%'
  @Input() option?: Record<string, unknown>
  /** Accessible name announced for the chart image. */
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

  /** Clamped fill 0..100, like React/Vue `pct`. */
  get pct(): number {
    return Math.max(0, Math.min(100, this.value))
  }

  get resolvedAriaLabel(): string {
    return this.ariaLabel || `Liquid fill chart at ${Math.round(this.pct)}${this.unit}`
  }

  /** Build the merged ECharts option (pure — no DOM needed, unit-testable). */
  getOption(): Record<string, unknown> {
    const colors = getChartColors()
    const level = this.pct / 100
    const unit = this.unit
    const series = [
      {
        type: 'gauge',
        startAngle: 90,
        endAngle: -270,
        min: 0,
        max: 1,
        progress: { show: true, width: 14, itemStyle: { color: this.color } },
        axisLine: { lineStyle: { width: 14, color: [[1, toRgba(this.color, 0.18)]] } },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        pointer: { show: false },
        anchor: { show: false },
        title: { show: false },
        detail: {
          show: this.showLabel,
          valueAnimation: true,
          fontSize: 30,
          fontWeight: 'bold',
          color: getChartTextColor(),
          formatter: (v: number) => `${Math.round(v * 100)}${unit}`,
        },
        data: [{ value: level }],
      },
    ]
    const userOption: Record<string, any> = this.option ?? {}
    const { series: userSeries, tooltip: userTooltip, ...userRest } = userOption
    const mergedSeries = Array.isArray(userSeries) ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) })) : series
    return {
      color: colors,
      tooltip: {
        trigger: 'item',
        backgroundColor: getChartTooltipBg(),
        borderColor: getChartTooltipBorder(),
        textStyle: { color: getChartTextColor(), fontSize: 12 },
        ...(typeof userTooltip === 'object' && userTooltip !== null ? userTooltip : {}),
      },
      series: mergedSeries,
      ...userRest,
    }
  }

  async ngAfterViewInit(): Promise<void> {
    if (typeof window === 'undefined' || !this.chartEl?.nativeElement) return
    const [{ use }, { CanvasRenderer }, { GaugeChart: EChartsGaugeChart }, comps] = await Promise.all([
      import('echarts/core'),
      import('echarts/renderers'),
      import('echarts/charts'),
      import('echarts/components'),
    ])
    use([CanvasRenderer, EChartsGaugeChart, comps.TooltipComponent])
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
      (changes['value'] || changes['color'] || changes['showLabel'] || changes['unit'] || changes['option'])
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
