import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
  booleanAttribute,
  ChangeDetectionStrategy,
} from '@angular/core'
import type * as echarts from 'echarts/core'
import { cn } from '@/lib/utils'
import {
  getChartColors,
  getChartTextColor,
  getChartAxisColor,
  getChartSplitLineColor,
  getChartTooltipBg,
  getChartTooltipBorder,
  getChartTooltipText,
  mergeOptionBlock,
} from '../use-chart-theme'

/**
 * Angular port of the UIPKGE WaterfallChart — signed deltas accumulate from a transparent base. Standalone, theme-aware. Same inputs as the Vue `WaterfallChart` (`data`, `showTotal`, `height`, `option`).
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-waterfall-chart, [ui-waterfall-chart]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"waterfall-chart"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
    '[attr.role]': '"img"',
    '[attr.aria-label]': 'ariaLabel || "Chart"',
    '[attr.tabindex]': '0',
    '[style.height]': 'heightStyle',
  },
  template: `<div #chartEl class="size-full"></div>`,
})
export class UiWaterfallChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  /** `{ label, value }` signed deltas in order. */
  @Input() data: { label: string; value: number }[] = []
  /** Append a computed Total bar. Default true. */
  @Input({ transform: booleanAttribute }) showTotal = true
  @Input() height: number | string = 320
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
  /** Accumulated base/uplift/style rows incl. optional total. Pure — unit-tested. */
  rows(): { label: string; base: number; uplift: number; total: boolean }[] {
    const out: { label: string; base: number; uplift: number; total: boolean }[] = []
    let cursor = 0
    for (const d of this.data) {
      if (d.value >= 0) {
        out.push({ label: d.label, base: cursor, uplift: d.value, total: false })
        cursor += d.value
      } else {
        cursor += d.value
        out.push({ label: d.label, base: cursor, uplift: -d.value, total: false })
      }
    }
    if (this.showTotal && this.data.length) out.push({ label: 'Total', base: 0, uplift: cursor, total: true })
    return out
  }

  /** Build the merged ECharts option (pure — no DOM needed, unit-testable). */
  getOption(): Record<string, unknown> {
    const colors = getChartColors()
    const up = colors[1]!
    const down = colors[3]!
    const totalColor = colors[0]!
    const rows = this.rows()
    const series = [
      {
        name: 'base',
        type: 'bar',
        stack: 'fall',
        silent: true,
        barMaxWidth: 30,
        itemStyle: { color: 'transparent', borderColor: 'transparent' },
        data: rows.map((r) => (r.total ? 0 : r.base)),
      },
      {
        name: 'delta',
        type: 'bar',
        stack: 'fall',
        barMaxWidth: 30,
        itemStyle: { borderRadius: [6, 6, 6, 6] },
        label: { show: true, position: 'top', color: getChartTextColor(), fontSize: 11 },
        data: rows.map((r, i) => {
          const orig = r.total ? undefined : this.data[i]
          const color = r.total ? totalColor : (orig?.value ?? 0) >= 0 ? up : down
          return { value: r.uplift, itemStyle: { color } }
        }),
      },
    ]
    const userOption: Record<string, any> = this.option ?? {}
    const {
      series: userSeries,
      xAxis: userXAxis,
      yAxis: userYAxis,
      grid: userGrid,
      tooltip: userTooltip,
      ...userRest
    } = userOption
    const mergedSeries = Array.isArray(userSeries) ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) })) : series
    return {
      color: colors,
      grid: mergeOptionBlock(
        { left: 16, right: 16, top: 32, bottom: 24, outerBoundsMode: 'same', outerBoundsContain: 'axisLabel' },
        userGrid,
      ),
      tooltip: mergeOptionBlock(
        {
          trigger: 'axis',
          backgroundColor: getChartTooltipBg(),
          borderColor: getChartTooltipBorder(),
          textStyle: { color: getChartTooltipText(), fontSize: 12 },
        },
        userTooltip,
      ),
      xAxis: mergeOptionBlock(
        {
          type: 'category',
          data: rows.map((r) => r.label),
          axisLine: { lineStyle: { color: getChartAxisColor() } },
          axisLabel: { color: getChartTextColor(), fontSize: 11 },
          axisTick: { show: false },
        },
        userXAxis,
      ),
      yAxis: mergeOptionBlock(
        {
          type: 'value',
          splitLine: { lineStyle: { color: getChartSplitLineColor() } },
          axisLabel: { color: getChartTextColor(), fontSize: 11 },
        },
        userYAxis,
      ),
      series: mergedSeries,
      ...userRest,
    }
  }

  async ngAfterViewInit(): Promise<void> {
    if (typeof window === 'undefined' || !this.chartEl?.nativeElement) return
    const [{ use }, { CanvasRenderer }, { BarChart: EChartsBarChart }, comps] = await Promise.all([
      import('echarts/core'),
      import('echarts/renderers'),
      import('echarts/charts'),
      import('echarts/components'),
    ])
    use([CanvasRenderer, EChartsBarChart, comps.GridComponent, comps.TooltipComponent])
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
    if (this.chart && (changes['data'] || changes['option'] || changes['showTotal'])) {
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
