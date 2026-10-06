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
  toRgba,
} from '../use-chart-theme'

export interface TreemapNode {
  name: string
  value?: number
  children?: TreemapNode[]
}

/**
 * Angular port of the UIPKGE TreemapChart — nested rectangles sized by
 * value. Standalone, theme-aware.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-treemap-chart, [ui-treemap-chart]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"treemap-chart"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
    '[attr.role]': '"img"',
    '[attr.aria-label]': 'ariaLabel || "Chart"',
    '[attr.tabindex]': '0',
    '[style.height]': 'heightStyle',
  },
  template: `<div #chartEl class="size-full"></div>`,
})
export class UiTreemapChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() data: TreemapNode[] = []
  /** Show breadcrumb at top when drilling into a sub-tree. Default false. */
  @Input() showBreadcrumb = false
  /** Leaf corner rounding in px (Angular-only styling knob). Default 4. */
  @Input() radius = 4
  @Input() height: number | string = 320
  @Input() option?: Record<string, unknown>
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  @Input() ariaLabel?: string
  @Input('class') className?: string

  leafCount(): number {
    let n = 0
    const walk = (nodes: TreemapNode[]) => {
      for (const node of nodes) {
        if ((node.children ?? []).length) walk(node.children as TreemapNode[])
        else n++
      }
    }
    walk(this.data)
    return n
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
    const textColor = getChartTextColor()
    const series = [
      {
        type: 'treemap',
        // Explicit anchors keep the layout at 0,0 — without these the (invisible)
        // breadcrumb reserves ~22px at the top (Vue parity comment).
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        width: 'auto',
        height: 'auto',
        roam: false,
        nodeClick: false,
        breadcrumb: { show: this.showBreadcrumb, height: 0 },
        label: {
          show: true,
          formatter: ({ name, value }: any) => (value ? `{b|${name}}\n{v|${value}}` : name),
          rich: {
            b: { color: textColor, fontSize: 11, fontWeight: 600, lineHeight: 14 },
            v: { color: toRgba(textColor, 0.85), fontSize: 10, fontWeight: 500, lineHeight: 12 },
          },
          overflow: 'truncate',
          ellipsis: '…',
        },
        labelLayout: { hideOverlap: false },
        upperLabel: { show: false },
        // gapWidth reads as separation already; an explicit borderColor would render
        // as a contrasting stripe on the consumer's theme (Vue parity comment).
        itemStyle: { borderWidth: 0, gapWidth: 2, borderRadius: this.radius },
        colorSaturation: [0.45, 0.7],
        data: this.data,
      },
    ]
    const userOption: Record<string, any> = this.option ?? {}
    const { series: userSeries, tooltip: userTooltip, ...userRest } = userOption
    // Per-index series merge — partial overrides keep computed `type`/`data` (React/Vue parity).
    const mergedSeries = Array.isArray(userSeries) ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) })) : series
    return {
      color: colors,
      tooltip: mergeOptionBlock(
        {
          formatter: (info: any) => {
            const parts = info.treePathInfo.map((n: any) => n.name).filter(Boolean)
            return `<strong>${parts.join(' / ')}</strong><br>${info.value?.toLocaleString?.() ?? info.value}`
          },
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
    return [charts['TreemapChart'], comps['TooltipComponent'], comps['TitleComponent']]
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
