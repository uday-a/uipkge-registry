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
  mergeOptionBlock,
} from '../use-chart-theme'

/**
 * Angular port of the UIPKGE SankeyChart — flow diagram with gradient
 * links and adjacency focus. Standalone, theme-aware.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-sankey-chart, [ui-sankey-chart]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"sankey-chart"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
    '[attr.role]': '"img"',
    '[attr.aria-label]': 'ariaLabel || "Chart"',
    '[attr.tabindex]': '0',
    '[style.height]': 'heightStyle',
  },
  template: `<div #chartEl class="size-full"></div>`,
})
export class UiSankeyChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  /** Node names. If omitted, derived from the union of link sources + targets. */
  @Input() nodes?: string[]
  @Input() links: { source: string; target: string; value: number }[] = []
  @Input() height: number | string = 360
  /** Curvature of the link ribbons. 0 = straight, 1 = max curve. Default 0.5. */
  @Input() curveness = 0.5
  @Input() option?: Record<string, unknown>
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  @Input() ariaLabel?: string
  @Input('class') className?: string

  totalFlow(): number {
    return this.links.reduce((sum, l) => sum + (l.value || 0), 0)
  }

  nodeNames(): string[] {
    return this.nodes ?? Array.from(new Set(this.links.flatMap((l) => [l.source, l.target])))
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
    const userOption: Record<string, any> = this.option ?? {}
    const { series: userSeries, tooltip: userTooltip, ...userRest } = userOption
    const series = [
      {
        type: 'sankey',
        left: 16,
        right: 72,
        top: 12,
        bottom: 12,
        data: this.nodeNames().map((name) => ({ name })),
        links: this.links,
        lineStyle: { color: 'gradient', curveness: this.curveness },
        label: { color: getChartTextColor(), fontSize: 11 },
        itemStyle: { borderWidth: 0 },
        emphasis: { focus: 'adjacency' },
      },
    ]
    const mergedSeries = Array.isArray(userSeries) ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) })) : series
    return {
      color: colors,
      tooltip: mergeOptionBlock(
        {
          trigger: 'item',
          backgroundColor: getChartTooltipBg(),
          borderColor: getChartTooltipBorder(),
          textStyle: { color: getChartTooltipText(), fontSize: 12 },
        },
        userTooltip,
      ),
      series: mergedSeries,
      ...userRest,
    }
  }

  /** ECharts chart + component modules, resolved lazily so SSR never loads canvas code. */
  private chartModules(charts: Record<string, unknown>, comps: Record<string, unknown>): unknown[] {
    return [charts['SankeyChart'], comps['TooltipComponent'], comps['TitleComponent']]
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
