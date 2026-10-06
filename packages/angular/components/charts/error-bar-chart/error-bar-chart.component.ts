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
 * Angular port of the UIPKGE ErrorBarChart — mean bars with CI whiskers and caps. Standalone, theme-aware. Same inputs as the React/Vue `ErrorBarChart` (`data`, `height`, `option`).
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-error-bar-chart, [ui-error-bar-chart]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"error-bar-chart"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
    '[attr.role]': '"img"',
    '[attr.aria-label]': 'ariaLabel || "Chart"',
    '[attr.tabindex]': '0',
    '[style.height]': 'heightStyle',
  },
  template: `<div #chartEl class="size-full"></div>`,
})
export class UiErrorBarChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  /** `{ category, value, low, high }` per row. */
  @Input() data: { category: string; value: number; low: number; high: number }[] = []
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

  /** Build the merged ECharts option (pure — no DOM needed, unit-testable). */
  getOption(): Record<string, unknown> {
    const colors = getChartColors()
    const whisker = getChartTextColor()
    const rows = this.data
    const series = [
      {
        name: 'value',
        type: 'bar',
        barMaxWidth: 30,
        itemStyle: { color: colors[0], borderRadius: [6, 6, 6, 6] },
        data: this.data.map((d) => d.value),
      },
      {
        name: 'interval',
        type: 'custom',
        silent: true,
        renderItem: (params: { dataIndex: number }, api: { coord: (p: number[]) => number[] }) => {
          const d = this.data[params.dataIndex]!
          const cx = api.coord([params.dataIndex, 0])[0]!
          const yLow = api.coord([params.dataIndex, d.low])[1]!
          const yHigh = api.coord([params.dataIndex, d.high])[1]!
          const cap = 7
          return {
            type: 'group',
            children: [
              {
                type: 'line',
                shape: { x1: cx, y1: yLow, x2: cx, y2: yHigh },
                style: { stroke: whisker, lineWidth: 1.5 },
              },
              {
                type: 'line',
                shape: { x1: cx - cap, y1: yLow, x2: cx + cap, y2: yLow },
                style: { stroke: whisker, lineWidth: 1.5 },
              },
              {
                type: 'line',
                shape: { x1: cx - cap, y1: yHigh, x2: cx + cap, y2: yHigh },
                style: { stroke: whisker, lineWidth: 1.5 },
              },
            ],
          }
        },
        data: this.data.map((d) => [d.low, d.high]),
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
        { left: 16, right: 16, top: 24, bottom: 24, outerBoundsMode: 'same', outerBoundsContain: 'axisLabel' },
        userGrid,
      ),
      tooltip: mergeOptionBlock(
        {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
          backgroundColor: getChartTooltipBg(),
          borderColor: getChartTooltipBorder(),
          textStyle: { color: getChartTooltipText(), fontSize: 12 },
          formatter: (ps: { dataIndex: number }[]) => {
            const d = rows[ps[0]?.dataIndex ?? -1]
            return d ? `${d.category}<br/>${d.value} (CI ${d.low}–${d.high})` : ''
          },
        },
        userTooltip,
      ),
      legend: { show: false },
      xAxis: mergeOptionBlock(
        {
          type: 'category',
          data: rows.map((d) => d.category),
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
    const [{ use }, { CanvasRenderer }, { BarChart: EChartsBarChart, CustomChart: EChartsCustomChart }, comps] =
      await Promise.all([
        import('echarts/core'),
        import('echarts/renderers'),
        import('echarts/charts'),
        import('echarts/components'),
      ])
    use([
      CanvasRenderer,
      EChartsBarChart,
      EChartsCustomChart,
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
    if (this.chart && (changes['data'] || changes['option'])) {
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
