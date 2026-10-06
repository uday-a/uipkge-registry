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
 * Angular port of the UIPKGE BulletChart — qualitative bands, actual bar, target marker per row. Standalone, theme-aware. Same inputs as the Vue `BulletChart` (`data`, `height`, `option`).
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-bullet-chart, [ui-bullet-chart]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"bullet-chart"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
    '[attr.role]': '"img"',
    '[attr.aria-label]': 'ariaLabel || "Chart"',
    '[attr.tabindex]': '0',
    '[style.height]': 'heightStyle',
  },
  template: `<div #chartEl class="size-full"></div>`,
})
export class UiBulletChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  /** `{ label, actual, target, ranges: [poor, ok, good] }` per row. */
  @Input() data: { label: string; actual: number; target: number; ranges: [number, number, number] }[] = []
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
    const labels = this.data.map((d) => d.label)
    const range0 = this.data.map((d) => d.ranges[0])
    const range1 = this.data.map((d) => d.ranges[1] - d.ranges[0])
    const range2 = this.data.map((d) => d.ranges[2] - d.ranges[1])
    const series = [
      {
        name: 'poor',
        type: 'bar',
        stack: 'ranges',
        silent: true,
        barWidth: 18,
        itemStyle: { color: getChartSplitLineColor() },
        data: range0,
      },
      {
        name: 'ok',
        type: 'bar',
        stack: 'ranges',
        silent: true,
        itemStyle: { color: getChartAxisColor(), opacity: 0.85 },
        data: range1,
      },
      {
        name: 'good',
        type: 'bar',
        stack: 'ranges',
        silent: true,
        itemStyle: { color: colors[4], opacity: 0.35 },
        data: range2,
      },
      {
        name: 'actual',
        type: 'bar',
        barWidth: 7,
        barGap: '-90%',
        z: 3,
        itemStyle: { color: colors[0], borderRadius: 3 },
        label: { show: true, position: 'right', color: getChartTextColor(), fontSize: 11 },
        data: this.data.map((d) => d.actual),
      },
      {
        name: 'target',
        type: 'scatter',
        z: 4,
        symbol: 'rect',
        symbolSize: [3, 24],
        itemStyle: { color: getChartTextColor() },
        data: this.data.map((d, i) => [d.target, i]),
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
        { left: 16, right: 16, top: 16, bottom: 16, outerBoundsMode: 'same', outerBoundsContain: 'axisLabel' },
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
          type: 'value',
          splitLine: { lineStyle: { color: getChartSplitLineColor() } },
          axisLabel: { color: getChartTextColor(), fontSize: 11 },
        },
        userXAxis,
      ),
      yAxis: mergeOptionBlock(
        {
          type: 'category',
          data: labels,
          inverse: true,
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
    const [{ use }, { CanvasRenderer }, { BarChart: EChartsBarChart, ScatterChart: EChartsScatterChart }, comps] =
      await Promise.all([
        import('echarts/core'),
        import('echarts/renderers'),
        import('echarts/charts'),
        import('echarts/components'),
      ])
    use([CanvasRenderer, EChartsBarChart, EChartsScatterChart, comps.GridComponent, comps.TooltipComponent])
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
