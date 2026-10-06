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
 * Angular port of the UIPKGE RangeBarChart — floating min/max bands via a transparent base stack. Standalone, theme-aware. Same inputs as the Vue `RangeBarChart` (`data`, `orientation`, `height`, `option`).
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-range-bar-chart, [ui-range-bar-chart]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"range-bar-chart"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
    '[attr.role]': '"img"',
    '[attr.aria-label]': 'ariaLabel || "Chart"',
    '[attr.tabindex]': '0',
    '[style.height]': 'heightStyle',
  },
  template: `<div #chartEl class="size-full"></div>`,
})
export class UiRangeBarChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  /** `{ label, low, high }` per band. */
  @Input() data: { label: string; low: number; high: number }[] = []
  /** 'vertical' columns or 'horizontal' bars. Default 'vertical'. */
  @Input() orientation: 'vertical' | 'horizontal' = 'vertical'
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
    const base = this.data.map((d) => d.low)
    const span = this.data.map((d) => d.high - d.low)
    const horizontal = this.orientation === 'horizontal'
    const catAxis = {
      type: 'category',
      data: labels,
      axisLine: { lineStyle: { color: getChartAxisColor() } },
      axisLabel: { color: getChartTextColor(), fontSize: 11 },
      axisTick: { show: false },
    }
    const valAxis = {
      type: 'value',
      splitLine: { lineStyle: { color: getChartSplitLineColor() } },
      axisLabel: { color: getChartTextColor(), fontSize: 11 },
    }
    const series = [
      {
        name: 'base',
        type: 'bar',
        stack: 'range',
        silent: true,
        barMaxWidth: 24,
        itemStyle: { color: 'transparent', borderColor: 'transparent' },
        data: base,
      },
      {
        name: 'range',
        type: 'bar',
        stack: 'range',
        barMaxWidth: 24,
        itemStyle: { color: colors[0], borderRadius: [6, 6, 6, 6] },
        label: {
          show: true,
          position: horizontal ? 'right' : 'top',
          color: getChartTextColor(),
          fontSize: 10,
          formatter: (p: { dataIndex: number }) => `${this.data[p.dataIndex]!.low}–${this.data[p.dataIndex]!.high}`,
        },
        data: span,
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
          backgroundColor: getChartTooltipBg(),
          borderColor: getChartTooltipBorder(),
          textStyle: { color: getChartTooltipText(), fontSize: 12 },
        },
        userTooltip,
      ),
      xAxis: mergeOptionBlock(horizontal ? valAxis : catAxis, userXAxis),
      yAxis: mergeOptionBlock(horizontal ? catAxis : valAxis, userYAxis),
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
    if (this.chart && (changes['data'] || changes['option'] || changes['orientation'])) {
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
