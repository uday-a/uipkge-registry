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
  getChartSplitLineColor,
  getChartTextColor,
  getChartTooltipBg,
  getChartTooltipBorder,
  getChartTooltipText,
  mergeOptionBlock,
} from '../use-chart-theme'

/**
 * Angular port of the UIPKGE DonutChart — full ring or half semicircle gauge
 * with rounded segments and a center total. Standalone, theme-aware.
 * Same inputs as the React/Vue `DonutChart`.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-donut-chart, [ui-donut-chart]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"donut-chart"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
    '[attr.role]': '"img"',
    '[attr.aria-label]': 'resolvedAriaLabel',
    '[attr.tabindex]': '0',
    '[style.height]': 'heightStyle',
  },
  template: `<div #chartEl class="size-full"></div>`,
})
export class UiDonutChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() data: { name: string; value: number }[] = []
  /** 'full' ring or 'half' semicircle gauge. Default 'full'. */
  @Input() type: 'full' | 'half' = 'full'
  /** Ring thickness as a fraction of the outer radius (0 = filled pie). Default 0.32. */
  @Input() thickness = 0.32
  /** Segment corner rounding in px. Default 6. */
  @Input() rounded = 6
  /** Gap between segments in degrees. Default 2. */
  @Input() gap = 2
  /** Show the summed total in the centre. Default true. */
  @Input() showTotal = true
  /** Centre label override (replaces the auto total). */
  @Input() centerLabel?: string
  @Input() height: number | string = 300
  @Input() option?: Record<string, unknown>
  /** Accessible name announced for the chart image. Defaults to "Donut chart, total <n>". */
  @Input() ariaLabel?: string
  @Input('class') className?: string

  total(): number {
    return this.data.reduce((sum, d) => sum + (Number(d.value) || 0), 0)
  }

  get resolvedAriaLabel(): string {
    return this.ariaLabel || `Donut chart, total ${this.total()}`
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
    const colors = getChartColors()
    const half = this.type === 'half'
    const outer = half ? 82 : 78
    const inner = Math.max(0, +(outer * (1 - Math.max(0, Math.min(0.95, this.thickness)))).toFixed(1))
    const total = this.total()
    const summary = this.centerLabel ?? String(total)
    const series = [
      {
        type: 'pie',
        radius: [`${inner}%`, `${outer}%`],
        center: half ? ['50%', '68%'] : ['50%', '46%'],
        startAngle: half ? 180 : 90,
        endAngle: half ? 360 : undefined,
        padAngle: this.gap,
        itemStyle: { borderRadius: this.rounded, borderColor: getChartTooltipBg(), borderWidth: 2 },
        label: { show: !half, color: getChartTextColor(), fontSize: 11 },
        labelLine: { show: !half, lineStyle: { color: getChartTextColor() } },
        emphasis: { scale: true, scaleSize: 3 },
        data: this.data,
      },
    ]

    const userOption: Record<string, any> = this.option ?? {}
    const { series: userSeries, tooltip: userTooltip, legend: userLegend, title: userTitle, ...userRest } = userOption
    const mergedSeries = Array.isArray(userSeries)
      ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) }))
      : series

    return {
      color: colors,
      title: this.showTotal
        ? mergeOptionBlock(
            {
              text: summary,
              left: 'center',
              top: half ? '62%' : '42%',
              textStyle: { fontSize: 26, fontWeight: 700, color: getChartTextColor() },
            },
            userTitle,
          )
        : undefined,
      tooltip: mergeOptionBlock(
        {
          trigger: 'item',
          backgroundColor: getChartTooltipBg(),
          borderColor: getChartTooltipBorder(),
          textStyle: { color: getChartTooltipText(), fontSize: 12 },
          valueFormatter: (v: number) => `${v} (${((v / (total || 1)) * 100).toFixed(1)}%)`,
        },
        userTooltip,
      ),
      legend: mergeOptionBlock(
        {
          bottom: 0,
          icon: 'circle',
          itemWidth: 8,
          itemHeight: 8,
          textStyle: { fontSize: 11, color: getChartTextColor() },
        },
        userLegend,
      ),
      series: mergedSeries,
      ...userRest,
    }
  }

  /** ECharts chart + component modules, resolved lazily so SSR never loads canvas code. */
  private chartModules(charts: Record<string, unknown>, comps: Record<string, unknown>): unknown[] {
    return [charts['PieChart'], comps['TooltipComponent'], comps['LegendComponent'], comps['TitleComponent']]
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
