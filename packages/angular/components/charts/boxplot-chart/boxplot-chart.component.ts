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
  getChartSplitLineColor,
  getChartTooltipBg,
  getChartTooltipBorder,
  getChartTooltipText,
  mergeOptionBlock,
} from '../use-chart-theme'

export interface BoxRow {
  category: string
  /** [min, Q1, median, Q3, max] */
  values: [number, number, number, number, number]
}

/**
 * Angular port of the UIPKGE BoxplotChart — precomputed five-number tuples rendered per
 * category. Standalone, theme-aware. Same inputs as the React/Vue `BoxplotChart` (`data`,
 * `horizontal`, `height`, `option`). Bare `w-full` frame (no tabindex/focus ring), like Vue.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-boxplot-chart, [ui-boxplot-chart]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"boxplot-chart"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
    '[attr.role]': '"img"',
    '[attr.aria-label]': 'ariaLabel || "Chart"',
    '[style.height]': 'heightStyle',
  },
  template: `<div #chartEl class="size-full"></div>`,
})
export class UiBoxplotChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  /** `{ category, values: [min, Q1, median, Q3, max] }` per group. Passed straight to ECharts. */
  @Input() data: BoxRow[] = []
  /** Flip to horizontal boxes. Default false. */
  @Input() horizontal = false
  @Input() height: number | string = 320
  @Input() option?: Record<string, unknown>
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  @Input() ariaLabel?: string
  @Input('class') className?: string

  @ViewChild('chartEl', { static: false }) chartEl?: ElementRef<HTMLDivElement>

  private chart: echarts.ECharts | null = null
  private unsubscribeTheme: (() => void) | null = null

  get hostClass(): string {
    return cn('block w-full', this.className)
  }

  get heightStyle(): string {
    return /^\d+$/.test(String(this.height)) ? `${this.height}px` : String(this.height)
  }

  /** Build the merged ECharts option (pure — no DOM needed, unit-testable). */
  getOption(): Record<string, unknown> {
    const colors = getChartColors()
    const cats = this.data.map((d) => d.category)
    const values = this.data.map((d) => d.values)
    const series = [
      {
        type: 'boxplot',
        data: values,
        itemStyle: { color: colors[0], borderColor: colors[1] },
      },
    ]
    const valueAxis = {
      type: 'value',
      scale: true,
      splitLine: { lineStyle: { color: getChartSplitLineColor() } },
      axisLabel: { color: getChartTextColor(), fontSize: 11 },
      axisLine: { lineStyle: { color: getChartAxisColor() } },
      axisTick: { show: false },
    }
    const catAxis = {
      type: 'category',
      data: cats,
      axisLine: { lineStyle: { color: getChartAxisColor() } },
      axisLabel: { color: getChartTextColor(), fontSize: 11 },
      axisTick: { show: false },
    }
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
        { left: 16, right: 16, top: 24, bottom: 24, outerBoundsMode: 'same', outerBoundsContain: 'axisLabel' },
        userGrid,
      ),
      tooltip: mergeOptionBlock(
        {
          trigger: 'item',
          backgroundColor: getChartTooltipBg(),
          borderColor: getChartTooltipBorder(),
          textStyle: { color: getChartTooltipText(), fontSize: 12 },
        },
        userTooltip,
      ),
      xAxis: mergeOptionBlock(this.horizontal ? valueAxis : catAxis, userXAxis),
      yAxis: mergeOptionBlock(this.horizontal ? catAxis : valueAxis, userYAxis),
      series: mergedSeries,
      ...userRest,
    }
  }

  async ngAfterViewInit(): Promise<void> {
    if (typeof window === 'undefined' || !this.chartEl?.nativeElement) return
    const [{ use }, { CanvasRenderer }, { BoxplotChart: EChartsBoxplotChart }, comps] = await Promise.all([
      import('echarts/core'),
      import('echarts/renderers'),
      import('echarts/charts'),
      import('echarts/components'),
    ])
    use([CanvasRenderer, EChartsBoxplotChart, comps.GridComponent, comps.TooltipComponent])
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
    if (this.chart && (changes['data'] || changes['option'] || changes['horizontal'])) {
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
