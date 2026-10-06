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

export interface TreeChartNode {
  name: string
  value?: number
  children?: TreeChartNode[]
  /** Collapse this branch on initial render. */
  collapsed?: boolean
}

/**
 * Angular port of the UIPKGE TreeChart — orthogonal/radial hierarchies. Standalone, theme-aware. Same inputs as the Vue `TreeChart` (`data`, `layout`, `orient`, `roam`, `height`, `option`).
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-tree-chart, [ui-tree-chart]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"tree-chart"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
    '[attr.role]': '"img"',
    '[attr.aria-label]': 'ariaLabel || "Chart"',
    '[attr.tabindex]': '0',
    '[style.height]': 'heightStyle',
  },
  template: `<div #chartEl class="size-full"></div>`,
})
export class UiTreeChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  /** Single root node (React/Vue `data`). Optional so the chart renders empty before data arrives. */
  @Input() data?: TreeChartNode
  /** orthogonal | radial. Default orthogonal. */
  @Input() layout: 'orthogonal' | 'radial' = 'orthogonal'
  /** LR | TB | RL | BT, or radial (React/Vue alias for `layout="radial"`). Default LR. */
  @Input() orient: 'LR' | 'TB' | 'RL' | 'BT' | 'radial' = 'LR'
  @Input() roam = false
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
    const layout = this.layout === 'radial' || this.orient === 'radial' ? 'radial' : 'orthogonal'
    const series = [
      {
        type: 'tree',
        data: this.data ? [this.data] : [],
        layout,
        orient: layout === 'orthogonal' ? this.orient : undefined,
        roam: this.roam,
        symbol: 'circle',
        symbolSize: 10,
        initialTreeDepth: -1,
        top: 16,
        bottom: 16,
        left: layout === 'radial' ? '5%' : 16,
        right: layout === 'radial' ? '5%' : 60,
        label: {
          fontSize: 11,
          color: getChartTextColor(),
          position: layout === 'radial' ? 'inside' : 'right',
          verticalAlign: 'middle',
          align: layout === 'radial' ? 'center' : 'left',
          distance: 6,
        },
        leaves: {
          label: { position: layout === 'radial' ? 'inside' : 'right' },
        },
        lineStyle: { color: getChartAxisColor(), width: 1.5, curveness: 0.5 },
        emphasis: { focus: 'descendant' },
        expandAndCollapse: true,
        itemStyle: { color: colors[0], borderColor: colors[0] },
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
        textStyle: { color: getChartTooltipText(), fontSize: 12 },
        ...(typeof userTooltip === 'object' && userTooltip !== null ? userTooltip : {}),
      },
      // ECharts' tree series needs a root node; with no data yet (e.g. still loading) it throws.
      series: this.data ? mergedSeries : [],
      ...userRest,
    }
  }

  async ngAfterViewInit(): Promise<void> {
    if (typeof window === 'undefined' || !this.chartEl?.nativeElement) return
    const [{ use }, { CanvasRenderer }, { TreeChart: EChartsTreeChart }, comps] = await Promise.all([
      import('echarts/core'),
      import('echarts/renderers'),
      import('echarts/charts'),
      import('echarts/components'),
    ])
    use([CanvasRenderer, EChartsTreeChart, comps.TooltipComponent])
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
    if (this.chart && (changes['data'] || changes['option'] || changes['layout'] || changes['orient'])) {
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
