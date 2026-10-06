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
 * Angular port of the UIPKGE PopulationPyramidChart — mirrored horizontal bars with absolute labels. Standalone, theme-aware. Same inputs as the Vue `PopulationPyramidChart` (`data`, `names`, `height`, `option`).
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-population-pyramid-chart, [ui-population-pyramid-chart]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"population-pyramid-chart"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
    '[attr.role]': '"img"',
    '[attr.aria-label]': 'ariaLabel || "Chart"',
    '[attr.tabindex]': '0',
    '[style.height]': 'heightStyle',
  },
  template: `<div #chartEl class="size-full"></div>`,
})
export class UiPopulationPyramidChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  /** `{ band, left, right }` per cohort. Left renders negated (left). */
  @Input() data: { band: string; left: number; right: number }[] = []
  /** Series names for [left, right]. Default ['Male', 'Female']. */
  @Input() names: [string, string] = ['Male', 'Female']
  @Input() height: number | string = 340
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
    const series = [
      {
        name: this.names[0],
        type: 'bar',
        stack: 'pop',
        barWidth: 14,
        itemStyle: { color: colors[2], borderRadius: [4, 4, 4, 4] },
        label: {
          show: true,
          position: 'left',
          color: getChartTextColor(),
          fontSize: 10,
          formatter: (p: { value: number }) => Math.abs(p.value),
        },
        data: this.data.map((d) => -Math.abs(d.left)),
      },
      {
        name: this.names[1],
        type: 'bar',
        stack: 'pop',
        barWidth: 14,
        itemStyle: { color: colors[0], borderRadius: [4, 4, 4, 4] },
        label: { show: true, position: 'right', color: getChartTextColor(), fontSize: 10 },
        data: this.data.map((d) => Math.abs(d.right)),
      },
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
      grid: mergeOptionBlock({ left: 16, right: 16, top: 24, bottom: 32, containLabel: true }, userGrid),
      tooltip: mergeOptionBlock(
        {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
          backgroundColor: getChartTooltipBg(),
          borderColor: getChartTooltipBorder(),
          textStyle: { color: getChartTooltipText(), fontSize: 12 },
          valueFormatter: (v: number) => Math.abs(v),
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
          type: 'value',
          splitLine: { lineStyle: { color: getChartSplitLineColor() } },
          axisLabel: { color: getChartTextColor(), fontSize: 11, formatter: (v: number) => Math.abs(v) },
        },
        userXAxis,
      ),
      yAxis: mergeOptionBlock(
        {
          type: 'category',
          inverse: true,
          data: this.data.map((d) => d.band),
          axisLine: { lineStyle: { color: getChartAxisColor() } },
          axisLabel: { color: getChartTextColor(), fontSize: 11 },
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
    if (this.chart && (changes['data'] || changes['option'] || changes['names'])) {
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
