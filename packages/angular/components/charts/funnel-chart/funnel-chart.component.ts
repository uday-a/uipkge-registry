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
  getChartBgColor,
  getChartColors,
  getChartTextColor,
  getChartTooltipBg,
  getChartTooltipBorder,
  getChartTooltipText,
  mergeOptionBlock,
} from '../use-chart-theme'

// Share of the top (largest) stage: '100%', '24%', '7.2%', '1.8%'.
function formatShare(value: number, top: number): string {
  if (!top) return '0%'
  const pct = (value / top) * 100
  return `${pct >= 10 ? Math.round(pct) : Math.round(pct * 10) / 10}%`
}

/**
 * Angular port of the UIPKGE FunnelChart — conversion stages with
 * configurable sort, orientation and gap. Standalone, theme-aware.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-funnel-chart, [ui-funnel-chart]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"funnel-chart"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
    '[attr.role]': '"img"',
    '[attr.aria-label]': 'ariaLabel || "Chart"',
    '[attr.tabindex]': '0',
    '[style.height]': 'heightStyle',
  },
  template: `<div #chartEl class="size-full"></div>`,
})
export class UiFunnelChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() data: { name: string; value: number; itemStyle?: Record<string, unknown> & { color?: string } }[] = []
  /** Sort order. Default 'descending'. */
  @Input() sort: 'descending' | 'ascending' | 'none' = 'descending'
  /** Layout orientation. Default 'vertical'. */
  @Input() orient: 'vertical' | 'horizontal' = 'vertical'
  /** Gap in px between stages. Default 2. */
  @Input() gap = 2
  @Input() showLabels = true
  @Input() showLegend = false
  @Input() height: number | string = 300
  @Input() option?: Record<string, unknown>
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  @Input() ariaLabel?: string
  @Input('class') className?: string

  sorted(): UiFunnelChartComponent['data'] {
    if (this.sort === 'none') return [...this.data]
    const dir = this.sort === 'ascending' ? 1 : -1
    return [...this.data].sort((a, b) => (a.value - b.value) * dir)
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
    const topValue = Math.max(0, ...this.data.map((d) => d.value))
    const userOption: Record<string, any> = this.option ?? {}
    const { series: userSeries, tooltip: userTooltip, legend: userLegend, ...userRest } = userOption
    return {
      color: colors,
      tooltip: mergeOptionBlock(
        {
          trigger: 'item',
          backgroundColor: getChartTooltipBg(),
          borderColor: getChartTooltipBorder(),
          textStyle: { color: getChartTooltipText(), fontSize: 12 },
          formatter: '{b}: {c}',
        },
        userTooltip,
      ),
      legend: this.showLegend
        ? mergeOptionBlock(
            {
              bottom: 0,
              icon: 'circle',
              itemWidth: 8,
              itemHeight: 8,
              textStyle: { fontSize: 11, color: getChartTextColor() },
            },
            userLegend,
          )
        : undefined,
      series: Array.isArray(userSeries)
        ? userSeries
        : [
            {
              type: 'funnel',
              orient: this.orient,
              sort: this.sort,
              // +6 absorbs the 3px outer half of the 6px stroke on each side.
              gap: this.gap + 6,
              // Geometry mirrors Vue: the 20% floor keeps the narrowest stage
              // wide enough for its inside label instead of a sharp point.
              left: '8%',
              right: '8%',
              top: 12,
              bottom: this.showLegend ? 32 : 12,
              minSize: '20%',
              maxSize: '100%',
              funnelAlign: 'center',
              // Inside labels use the card-surface ink (light on the saturated stage
              // fills, tracks light/dark) -- muted text was illegible on colour.
              // Two lines: stage name, then value · share of the top stage.
              label: {
                show: this.showLabels,
                position: 'inside',
                color: getChartBgColor(),
                formatter: (p: { name: string; value: number }) =>
                  `{t|${p.name}}\n{v|${p.value.toLocaleString()} · ${formatShare(p.value, topValue)}}`,
                rich: {
                  t: { fontSize: 12, fontWeight: 600, lineHeight: 16 },
                  v: { fontSize: 11, fontWeight: 500, lineHeight: 15 },
                },
              },
              labelLine: { show: false },
              itemStyle: { borderWidth: 6, borderJoin: 'round' },
              // ECharts funnel has no borderRadius; a same-colour round-join stroke softens corners (~3px radius).
              // Index i matches ECharts' palette assignment (series data order).
              data: this.sorted().map((d, i) => ({
                ...d,
                itemStyle: { ...d.itemStyle, borderColor: d.itemStyle?.color ?? colors[i % colors.length] },
              })),
            },
          ],
      ...userRest,
    }
  }

  /** ECharts chart + component modules, resolved lazily so SSR never loads canvas code. */
  private chartModules(charts: Record<string, unknown>, comps: Record<string, unknown>): unknown[] {
    return [charts['FunnelChart'], comps['TooltipComponent'], comps['LegendComponent'], comps['TitleComponent']]
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
