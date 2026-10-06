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
 * Angular port of the UIPKGE AlluvialChart — vertical sankey flows with curved gradient ribbons. Standalone, theme-aware via registry tokens. Same inputs as the Vue `AlluvialChart` (`links`, `nodes`, `curveness`, `height`, `option`).
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-alluvial-chart, [ui-alluvial-chart]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"alluvial-chart"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
    '[attr.role]': '"img"',
    '[attr.aria-label]': 'ariaLabel || "Alluvial chart"',
    '[attr.tabindex]': '0',
    '[style.height]': 'heightStyle',
  },
  template: `<div #chartEl class="size-full"></div>`,
})
export class UiAlluvialChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  /** `{ source, target, value }` edges between nodes. */
  @Input() links: { source: string; target: string; value: number }[] = []
  /** Node names. If omitted, derived from the union of link sources + targets. */
  @Input() nodes?: string[]
  /** Curvature of the ribbons. 0 = straight, 1 = max curve. Default 0.5. */
  @Input() curveness = 0.5
  @Input() height: number | string = 420
  @Input() option?: Record<string, unknown>
  /** Accessible name announced for the chart image. Defaults to "Alluvial chart". */
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
    const nodeNames = this.nodes ?? Array.from(new Set(this.links.flatMap((l) => [l.source, l.target])))
    const colors = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#84cc16']
    const series = [
      {
        type: 'sankey',
        orient: 'vertical',
        top: 16,
        bottom: 40,
        left: 12,
        right: 12,
        data: nodeNames.map((name) => ({ name })),
        links: this.links,
        nodeWidth: 14,
        nodeGap: 12,
        lineStyle: { color: 'gradient', curveness: this.curveness },
        label: { fontSize: 10, color: getChartTooltipText(), position: 'bottom', distance: 4 },
        emphasis: { focus: 'adjacency' },
        itemStyle: { borderWidth: 0 },
      },
    ]
    const userOption: Record<string, any> = this.option ?? {}
    const { series: userSeries, tooltip: userTooltip, ...userRest } = userOption
    const mergedSeries = Array.isArray(userSeries) ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) })) : series
    return {
      color: colors,
      tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove',
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
    const [{ use }, { CanvasRenderer }, { SankeyChart: EChartsSankeyChart }, comps] = await Promise.all([
      import('echarts/core'),
      import('echarts/renderers'),
      import('echarts/charts'),
      import('echarts/components'),
    ])
    use([CanvasRenderer, EChartsSankeyChart, comps.TooltipComponent, comps.LegendComponent])
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
      (changes['data'] || changes['option'] || changes['links'] || changes['nodes'] || changes['curveness'])
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
