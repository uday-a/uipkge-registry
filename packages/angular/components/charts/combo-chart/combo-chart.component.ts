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

/**
 * Angular port of the UIPKGE ComboChart — bars on the left axis, smooth lines on the right. Standalone, theme-aware. Same inputs as the Vue `ComboChart` (`data`, `xField`, `barField`, `lineField`, `height`, `option`).
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-combo-chart, [ui-combo-chart]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"combo-chart"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
    '[attr.role]': '"img"',
    '[attr.aria-label]': 'ariaLabel || "Chart"',
    '[attr.tabindex]': '0',
    '[style.height]': 'heightStyle',
  },
  template: `<div #chartEl class="size-full"></div>`,
})
export class UiComboChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() data: Record<string, unknown>[] = []
  @Input() xField = 'x'
  @Input() barField: string | string[] = 'bar'
  @Input() lineField: string | string[] = 'line'
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

  /** Build the merged ECharts option (pure — no DOM needed, unit-testable). */
  getOption(): Record<string, unknown> {
    const colors = getChartColors()
    const bars = Array.isArray(this.barField) ? this.barField : [this.barField]
    const lines = Array.isArray(this.lineField) ? this.lineField : [this.lineField]
    const xData = this.data.map((d) => d[this.xField])
    const series = [
      ...bars.map((f, i) => ({
        name: f,
        type: 'bar',
        barMaxWidth: 28,
        itemStyle: { color: colors[i % colors.length], borderRadius: [6, 6, 6, 6] },
        data: this.data.map((d) => d[f]),
      })),
      ...lines.map((f, k) => ({
        name: f,
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: { width: 2, color: colors[(bars.length + k) % colors.length] },
        itemStyle: { color: colors[(bars.length + k) % colors.length] },
        data: this.data.map((d) => d[f]),
      })),
    ]
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
        { left: 16, right: 16, top: 24, bottom: 32, outerBoundsMode: 'same', outerBoundsContain: 'axisLabel' },
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
        [
          {
            type: 'value',
            splitLine: { lineStyle: { color: getChartSplitLineColor() } },
            axisLabel: { color: getChartTextColor(), fontSize: 11 },
          },
          { type: 'value', splitLine: { show: false }, axisLabel: { color: getChartTextColor(), fontSize: 11 } },
        ],
        userYAxis,
      ),
      series: mergedSeries,
      ...userRest,
    }
  }

  async ngAfterViewInit(): Promise<void> {
    if (typeof window === 'undefined' || !this.chartEl?.nativeElement) return
    const [{ use }, { CanvasRenderer }, { BarChart: EChartsBarChart, LineChart: EChartsLineChart }, comps] =
      await Promise.all([
        import('echarts/core'),
        import('echarts/renderers'),
        import('echarts/charts'),
        import('echarts/components'),
      ])
    use([
      CanvasRenderer,
      EChartsBarChart,
      EChartsLineChart,
      comps.GridComponent,
      comps.TooltipComponent,
      comps.LegendComponent,
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
    if (this.chart && (changes['data'] || changes['option'] || changes['barField'] || changes['lineField'])) {
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
