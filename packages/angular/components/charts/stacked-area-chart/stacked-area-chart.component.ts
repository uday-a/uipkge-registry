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
  toRgba,
} from '../use-chart-theme'

/**
 * Angular port of the UIPKGE StackedAreaChart — absolute or 100% stream stacking. Standalone, theme-aware. Inputs mirror React/Vue except `yField`: the Angular chart-family convention is a `string | string[]` superset of their required `yFields: string[]`.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-stacked-area-chart, [ui-stacked-area-chart]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"stacked-area-chart"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
    '[attr.role]': '"img"',
    '[attr.aria-label]': 'ariaLabel || "Chart"',
    '[attr.tabindex]': '0',
    '[style.height]': 'heightStyle',
  },
  template: `<div #chartEl class="size-full"></div>`,
})
export class UiStackedAreaChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() data: Record<string, unknown>[] = []
  @Input() xField = 'x'
  @Input() yField: string | string[] = 'y'
  /** Normalize each x to 100% shares. Default false. */
  @Input() percent = false
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
    const totals = this.data.map((d) => fields.reduce((s, f) => s + (+d[f]! || 0), 0) || 1)
    const series = fields.map((field, i) => ({
      name: field,
      type: 'line',
      smooth: true,
      stack: 'areas',
      symbol: 'none',
      lineStyle: { width: 1.5, color: colors[i % colors.length] },
      areaStyle: { color: toRgba(colors[i % colors.length]!, 0.45) },
      emphasis: { focus: 'series' },
      data: this.data.map((d, k) => (this.percent ? (+(+d[field]! || 0) / totals[k]!) * 100 : +d[field]! || 0)),
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
    const mergedSeries = Array.isArray(userSeries) ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) })) : series
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
          valueFormatter: (v: any) => (this.percent ? `${(+v).toFixed(1)}%` : v),
        },
        userTooltip,
      ),
      legend:
        fields.length > 1
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
      xAxis: mergeOptionBlock(
        {
          type: 'category',
          data: xData,
          boundaryGap: false,
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
    const [{ use }, { CanvasRenderer }, { LineChart: EChartsLineChart }, comps] = await Promise.all([
      import('echarts/core'),
      import('echarts/renderers'),
      import('echarts/charts'),
      import('echarts/components'),
    ])
    use([CanvasRenderer, EChartsLineChart, comps.GridComponent, comps.TooltipComponent, comps.LegendComponent])
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
    if (this.chart && (changes['data'] || changes['option'] || changes['percent'])) {
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
