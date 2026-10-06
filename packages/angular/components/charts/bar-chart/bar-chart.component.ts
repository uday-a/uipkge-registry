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
  getChartBgColor,
  getChartColors,
  getChartSplitLineColor,
  getChartTextColor,
  getChartTooltipBg,
  getChartTooltipBorder,
  getChartTooltipText,
  mergeOptionBlock,
} from '../use-chart-theme'

/**
 * Angular port of the UIPKGE BarChart — ECharts wrapper with vertical,
 * horizontal, grouped, stacked, and negative-value variants. Standalone,
 * theme-aware via registry tokens. Same inputs as the Vue `BarChart`.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-bar-chart, [ui-bar-chart]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"bar-chart"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
    '[attr.role]': '"img"',
    '[attr.aria-label]': 'ariaLabel || "Chart"',
    '[attr.tabindex]': '0',
    '[style.height]': 'heightStyle',
  },
  template: `<div #chartEl class="size-full"></div>`,
})
export class UiBarChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() data: Record<string, unknown>[] = []
  @Input() xField = 'x'
  @Input() yField: string | string[] = 'y'
  /** Stack series on one baseline. Default false. */
  @Input() stacked = false
  /** Gap in px between stacked bar segments. Default 1. Set to 0 to disable. */
  @Input() stackGap = 1
  /** Color of the gap between stacked bar segments. Defaults to card background. */
  @Input() stackGapColor?: string
  /** Show value labels on top of each bar. Default false. */
  @Input() valueLabels = false
  /** Top corner rounding in px. Default 6. */
  @Input() radius = 6
  @Input() height: number | string = 300
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

    const hasUserStack = Array.isArray(userSeries) && userSeries.some((s: any) => Boolean(s?.stack))
    const stackGap = this.stackGap
    const stackGapColor = this.stackGapColor ?? getChartBgColor()
    const defaultRadius = [this.radius, this.radius, this.radius, this.radius]

    const series = fields.map((field, i) => {
      const u = Array.isArray(userSeries) ? (userSeries[i] ?? {}) : {}
      const isStacked = Boolean(this.stacked || u?.stack || hasUserStack)
      return {
        // Single series hides the legend; blank name keeps the raw field key out of the tooltip.
        name: fields.length > 1 ? field : '',
        type: 'bar',
        stack: this.stacked ? 'bars' : undefined,
        barMaxWidth: 32,
        itemStyle: {
          color: colors[i % colors.length],
          borderRadius: defaultRadius,
          ...(isStacked && stackGap > 0 ? { borderColor: stackGapColor, borderWidth: stackGap } : {}),
        },
        label: this.valueLabels ? { show: true, position: 'top', color: getChartTextColor(), fontSize: 11 } : undefined,
        data: this.data.map((d) => d[field]),
      }
    })

    const count = Math.max(fields.length, Array.isArray(userSeries) ? userSeries.length : 0)
    const mergedSeries = Array.isArray(userSeries)
      ? Array.from({ length: count }, (_, i) => {
          const s: any = series[i] ?? { type: 'bar', barMaxWidth: 32, itemStyle: { color: colors[i % colors.length] } }
          const u = userSeries[i] ?? {}
          const isStacked = Boolean(this.stacked || s.stack || u?.stack || hasUserStack)
          return {
            ...s,
            ...u,
            itemStyle: {
              ...s.itemStyle,
              borderRadius: defaultRadius,
              ...(isStacked && stackGap > 0 ? { borderColor: stackGapColor, borderWidth: stackGap } : {}),
              ...(u.itemStyle ?? {}),
            },
          }
        })
      : series

    const baseLegend: Record<string, unknown> =
      fields.length > 1
        ? {
            bottom: 0,
            icon: 'circle',
            itemWidth: 8,
            itemHeight: 8,
            textStyle: { fontSize: 11, color: getChartTextColor() },
          }
        : { show: false }

    return {
      color: colors,
      grid: mergeOptionBlock(
        {
          left: 16,
          right: 16,
          top: 24,
          bottom: fields.length > 1 ? 32 : 24,
          outerBoundsMode: 'same',
          outerBoundsContain: 'axisLabel',
        },
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
      legend: userLegend?.show === false ? undefined : mergeOptionBlock(baseLegend, userLegend),
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
          splitLine: { lineStyle: { color: getChartSplitLineColor() } },
          axisLabel: { color: getChartTextColor(), fontSize: 11 },
          axisLine: { show: false },
          axisTick: { show: false },
        },
        userYAxis,
      ),
      series: mergedSeries,
      ...userRest,
    }
  }

  async ngAfterViewInit(): Promise<void> {
    if (typeof window === 'undefined' || !this.chartEl?.nativeElement) return
    const [{ use }, { CanvasRenderer }, { BarChart }, comps] = await Promise.all([
      import('echarts/core'),
      import('echarts/renderers'),
      import('echarts/charts'),
      import('echarts/components'),
    ])
    use([
      CanvasRenderer,
      BarChart,
      comps.GridComponent,
      comps.TooltipComponent,
      comps.LegendComponent,
      comps.MarkAreaComponent,
    ])
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
        changes['xField'] ||
        changes['yField'] ||
        changes['stacked'] ||
        changes['stackGap'] ||
        changes['stackGapColor'] ||
        changes['valueLabels'] ||
        changes['radius'])
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
