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
  getChartTooltipBg,
  getChartTooltipBorder,
  getChartTooltipText,
} from '../use-chart-theme'

/**
 * Angular port of the UIPKGE GraphChart — force/circular networks with directed edges. Standalone, theme-aware. Same inputs as the Vue `GraphChart` (`nodes`, `links`, `categories`, `layout`, `roam`, `directed`, `height`, `option`).
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-graph-chart, [ui-graph-chart]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"graph-chart"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
    '[attr.role]': '"img"',
    '[attr.aria-label]': 'ariaLabel || "Chart"',
    '[attr.tabindex]': '0',
    '[style.height]': 'heightStyle',
  },
  template: `<div #chartEl class="size-full"></div>`,
})
export class UiGraphChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  /** Nodes: `name` is the display label + link identity (like React/Vue); `id` is an accepted alias. */
  @Input() nodes: { id?: string; name?: string; category?: number; value?: number; symbolSize?: number }[] = []
  @Input() links: { source: string; target: string; value?: number }[] = []
  @Input() categories?: string[]
  /** force | circular | none. Default force. */
  @Input() layout: 'force' | 'circular' | 'none' = 'force'
  @Input() roam = false
  @Input() directed = true
  @Input() height: number | string = 380
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
    const series = [
      {
        type: 'graph',
        layout: this.layout,
        roam: this.roam,
        symbolSize: 28,
        label: { show: true, fontSize: 11, color: getChartTextColor() },
        edgeSymbol: this.directed ? (['none', 'arrow'] as [string, string]) : (['none', 'none'] as [string, string]),
        edgeSymbolSize: [0, 6],
        force: { repulsion: 220, edgeLength: 90 },
        lineStyle: { color: getChartAxisColor(), curveness: 0.15, width: 1 },
        emphasis: { focus: 'adjacency' as const, lineStyle: { width: 2 } },
        categories: this.categories?.map((name) => ({ name })),
        data: this.nodes.map((n) => ({
          ...n,
          name: n.name ?? n.id,
          itemStyle: typeof n.category === 'number' ? { color: colors[n.category % colors.length] } : {},
        })),
        links: this.links,
      },
    ]
    const userOption: Record<string, any> = this.option ?? {}
    const { series: userSeries, tooltip: userTooltip, legend: userLegend, ...userRest } = userOption
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
      legend:
        this.categories?.length || userLegend
          ? {
              bottom: 0,
              icon: 'circle',
              itemWidth: 8,
              itemHeight: 8,
              textStyle: { fontSize: 11, color: getChartTextColor() },
              ...(typeof userLegend === 'object' && userLegend !== null ? userLegend : {}),
            }
          : undefined,
      series: mergedSeries,
      ...userRest,
    }
  }

  async ngAfterViewInit(): Promise<void> {
    if (typeof window === 'undefined' || !this.chartEl?.nativeElement) return
    const [{ use }, { CanvasRenderer }, { GraphChart: EChartsGraphChart }, comps] = await Promise.all([
      import('echarts/core'),
      import('echarts/renderers'),
      import('echarts/charts'),
      import('echarts/components'),
    ])
    use([CanvasRenderer, EChartsGraphChart, comps.TooltipComponent, comps.LegendComponent])
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
      (changes['data'] || changes['option'] || changes['nodes'] || changes['links'] || changes['layout'])
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
