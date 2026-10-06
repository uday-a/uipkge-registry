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
} from '../use-chart-theme'

/**
 * Angular port of the UIPKGE WordCloudChart. The React/Vue source renders frequency-sized
 * markup; this standalone port encodes the same frequency sizing in a pure getOption()
 * labelled scatter. Inputs mirror React/Vue (`data`, `height`, `colors`); `option` is the
 * Angular ECharts escape hatch.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-word-cloud-chart, [ui-word-cloud-chart]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"word-cloud-chart"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
    '[attr.role]': '"img"',
    '[attr.aria-label]': 'ariaLabel || "Chart"',
    '[attr.tabindex]': '0',
    '[style.height]': 'heightStyle',
  },
  template: `<div #chartEl class="size-full"></div>`,
})
export class UiWordCloudChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  /** `{ name, value }` per word. Font scales with normalized frequency (same formula as React). */
  @Input() data: { name: string; value: number }[] = []
  @Input() height: number | string = 280
  /** Optional palette override. Defaults to chart-1..5 tokens. */
  @Input() colors?: string[]
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
  /** Font size 14..44 by normalized frequency (same formula as React). Pure — unit-tested. */
  fontFor(v: number, min: number, max: number): number {
    const span = Math.max(1, max - min)
    return 14 + ((v - min) / span) * 30
  }

  /** Label weight/opacity by normalized frequency (same thresholds as React). Pure — unit-tested. */
  weightFor(v: number, min: number, max: number): { weight: number; opacity: number } {
    const span = Math.max(1, max - min)
    return {
      weight: v === max ? 700 : v >= min + span * 0.66 ? 600 : 500,
      opacity: 0.55 + ((v - min) / span) * 0.45,
    }
  }

  /** Words sorted by descending value (same order React assigns palette slots in). */
  ordered(): { name: string; value: number }[] {
    return [...this.data].sort((a, b) => b.value - a.value)
  }

  /** Build the merged ECharts option (pure — no DOM needed, unit-testable). */
  getOption(): Record<string, unknown> {
    const colors = this.colors ?? getChartColors()
    const words = this.ordered()
    const vals = words.map((w) => w.value)
    const min = vals.length ? Math.min(...vals) : 0
    const max = vals.length ? Math.max(...vals) : 1
    const series = [
      {
        type: 'scatter',
        symbolSize: 1,
        data: words.map((w, i) => {
          const { weight, opacity } = this.weightFor(w.value, min, max)
          return {
            name: w.name,
            value: [(i % 6) * 20, Math.floor(i / 6) * 20, w.value],
            itemStyle: { color: colors[i % colors.length], opacity: 0 },
            label: {
              show: true,
              formatter: w.name,
              fontSize: this.fontFor(w.value, min, max),
              fontWeight: weight,
              color: colors[i % colors.length],
              opacity,
            },
          }
        }),
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
      xAxis: { type: 'value', show: false, min: -10, max: 120 },
      yAxis: { type: 'value', show: false, inverse: true },
      series: mergedSeries,
      ...userRest,
    }
  }

  async ngAfterViewInit(): Promise<void> {
    if (typeof window === 'undefined' || !this.chartEl?.nativeElement) return
    const [{ use }, { CanvasRenderer }, { ScatterChart: EChartsScatterChart }, comps] = await Promise.all([
      import('echarts/core'),
      import('echarts/renderers'),
      import('echarts/charts'),
      import('echarts/components'),
    ])
    use([CanvasRenderer, EChartsScatterChart, comps.GridComponent, comps.TooltipComponent])
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
    if (this.chart && (changes['data'] || changes['option'] || changes['colors'])) {
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
