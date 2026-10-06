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
  getChartAxisColor,
  getChartSplitLineColor,
  getChartTooltipBg,
  getChartTooltipBorder,
  getChartTooltipText,
  mergeOptionBlock,
} from '../use-chart-theme'

/**
 * Angular port of the UIPKGE StackedBarChart — absolute or 100% share stacking. Standalone, theme-aware. Inputs mirror React/Vue except `yField`: the Angular chart-family convention is a `string | string[]` superset of their required `yFields: string[]`.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-stacked-bar-chart, [ui-stacked-bar-chart]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"stacked-bar-chart"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
    '[attr.role]': '"img"',
    '[attr.aria-label]': 'ariaLabel || "Chart"',
    '[attr.tabindex]': '0',
    '[style.height]': 'heightStyle',
  },
  template: `<div #chartEl class="size-full"></div>`,
})
export class UiStackedBarChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() data: Record<string, unknown>[] = []
  @Input() xField = 'x'
  @Input() yField: string | string[] = 'y'
  /** Normalize each x to 100% shares. Default false. */
  @Input() percent = false
  /** Corner rounding in px. Default 6. */
  @Input() radius = 6
  /** Gap in px between stacked bar segments. Default 1. Set to 0 to disable. */
  @Input() stackGap = 1
  /** Color of the gap between stacked bar segments. Defaults to card background. */
  @Input() stackGapColor?: string
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
  fields(): string[] {
    return Array.isArray(this.yField) ? this.yField : [this.yField]
  }

  /** Build the merged ECharts option (pure — no DOM needed, unit-testable). */
  getOption(): Record<string, unknown> {
    const fields = this.fields()
    const colors = getChartColors()
    const xData = this.data.map((d) => d[this.xField])
    const totals = this.data.map((d) => fields.reduce((s, f) => s + Math.abs(+d[f]! || 0), 0) || 1)
    const gapColor = this.stackGapColor ?? getChartBgColor()
    const series = fields.map((field, i) => ({
      name: field,
      type: 'bar',
      stack: 'bars',
      barMaxWidth: 34,
      itemStyle: {
        color: colors[i % colors.length],
        borderRadius: [this.radius, this.radius, this.radius, this.radius],
        ...(this.stackGap > 0 ? { borderColor: gapColor, borderWidth: this.stackGap } : {}),
      },
      label: this.percent
        ? { show: true, color: '#fff', fontSize: 10, formatter: (p: any) => `${Math.round(p.value)}%` }
        : undefined,
      data: this.data.map((d, k) => (this.percent ? (+d[field]! / totals[k]!) * 100 : +d[field]! || 0)),
    }))
    const userOption: Record<string, any> = this.option ?? {}
    const {
      series: userSeries,
      xAxis: userXAxis,
      yAxis: userYAxis,
      grid: userGrid,
      tooltip: userTooltip,
      legend: userLegend,
      ...userRest
    } = userOption
    // Re-apply radius/gap onto user-supplied series too (Vue parity), letting an
    // explicit user itemStyle win.
    const count = Math.max(fields.length, Array.isArray(userSeries) ? userSeries.length : 0)
    const mergedSeries = Array.isArray(userSeries)
      ? Array.from({ length: count }, (_, i) => {
          const s: Record<string, any> = series[i] ?? {
            name: `series-${i}`,
            type: 'bar',
            stack: 'bars',
            barMaxWidth: 34,
            itemStyle: { color: colors[i % colors.length] },
          }
          const u: Record<string, any> = userSeries[i] ?? {}
          return {
            ...s,
            ...u,
            itemStyle: {
              ...s.itemStyle,
              borderRadius: [this.radius, this.radius, this.radius, this.radius],
              ...(this.stackGap > 0 ? { borderColor: gapColor, borderWidth: this.stackGap } : {}),
              ...(u.itemStyle ?? {}),
            },
          }
        })
      : series
    return {
      color: colors,
      grid: mergeOptionBlock(
        { left: 16, right: 16, top: 24, bottom: 32, outerBoundsMode: 'same', outerBoundsContain: 'axisLabel' },
        userGrid,
      ),
      tooltip: mergeOptionBlock(
        {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
          backgroundColor: getChartTooltipBg(),
          borderColor: getChartTooltipBorder(),
          textStyle: { color: getChartTooltipText(), fontSize: 12 },
          valueFormatter: (v: any) => (this.percent ? `${(+v).toFixed(1)}%` : v),
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
      xAxis: mergeOptionBlock(
        {
          type: 'category',
          data: xData,
          axisLine: { lineStyle: { color: getChartAxisColor() } },
          axisLabel: { color: getChartTextColor(), fontSize: 11 },
          axisTick: { show: false },
        },
        userXAxis,
      ),
      yAxis: mergeOptionBlock(
        {
          type: 'value',
          max: this.percent ? 100 : undefined,
          splitLine: { lineStyle: { color: getChartSplitLineColor() } },
          axisLabel: { color: getChartTextColor(), fontSize: 11, formatter: this.percent ? '{value}%' : '{value}' },
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
    use([CanvasRenderer, EChartsBarChart, comps.GridComponent, comps.TooltipComponent, comps.LegendComponent])
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
      (changes['data'] ||
        changes['option'] ||
        changes['percent'] ||
        changes['radius'] ||
        changes['stackGap'] ||
        changes['stackGapColor'])
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
