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
 * Angular port of the UIPKGE BubbleChart — XY scatter with square-root area scaling on the third dimension. Standalone, theme-aware. Same inputs as the Vue `BubbleChart` (`data`, `xField`, `yField`, `sizeField`, `opacity`, `minSize`, `maxSize`, `height`, `option`).
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-bubble-chart, [ui-bubble-chart]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"bubble-chart"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
    '[attr.role]': '"img"',
    '[attr.aria-label]': 'ariaLabel || "Chart"',
    '[attr.tabindex]': '0',
    '[style.height]': 'heightStyle',
  },
  template: `<div #chartEl class="size-full"></div>`,
})
export class UiBubbleChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() data: Record<string, unknown>[] = []
  @Input() xField = 'x'
  @Input() yField = 'y'
  @Input() sizeField = 'size'
  @Input() categoryField?: string
  @Input() opacity = 0.75
  @Input() minSize = 8
  @Input() maxSize = 42
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
  /** Square-root area scale so bubble AREA (not radius) encodes value. */
  scaleSize(v: number, max: number): number {
    return this.minSize + Math.sqrt(max > 0 ? v / max : 0) * (this.maxSize - this.minSize)
  }

  /** Build the merged ECharts option (pure — no DOM needed, unit-testable). */
  getOption(): Record<string, unknown> {
    const colors = getChartColors()
    const cats = this.categoryField ? [...new Set(this.data.map((d) => String(d[this.categoryField!])))] : ['default']
    const sizes = this.data.map((d) => +d[this.sizeField]! || 0)
    const maxSize = Math.max(...sizes, 1)
    const series = cats.map((cat, i) => ({
      name: String(cat),
      type: 'scatter',
      symbolSize: (val: number[]) => this.scaleSize(val[2]!, maxSize),
      itemStyle: { color: colors[i % colors.length], opacity: this.opacity },
      data: (this.categoryField ? this.data.filter((d) => String(d[this.categoryField!]) === cat) : this.data).map(
        (d) => [d[this.xField], d[this.yField], +d[this.sizeField]! || 0, d],
      ),
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
          bottom: cats.length > 1 ? 32 : 24,
          outerBoundsMode: 'same',
          outerBoundsContain: 'axisLabel',
        },
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
          axisLabel: { color: getChartTextColor(), fontSize: 11 },
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
    const [{ use }, { CanvasRenderer }, { ScatterChart: EChartsScatterChart }, comps] = await Promise.all([
      import('echarts/core'),
      import('echarts/renderers'),
      import('echarts/charts'),
      import('echarts/components'),
    ])
    use([CanvasRenderer, EChartsScatterChart, comps.GridComponent, comps.TooltipComponent, comps.LegendComponent])
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
      (changes['data'] || changes['option'] || changes['opacity'] || changes['minSize'] || changes['maxSize'])
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
