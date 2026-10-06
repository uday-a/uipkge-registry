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
  getChartTooltipBg,
  getChartTooltipBorder,
  getChartTooltipText,
  mergeOptionBlock,
} from '../use-chart-theme'

/**
 * Angular port of the UIPKGE PolarBarChart — radial bars on the polar coordinate system. Standalone, theme-aware. Same inputs as the Vue `PolarBarChart` (`data`, `height`, `option`).
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-polar-bar-chart, [ui-polar-bar-chart]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"polar-bar-chart"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
    '[attr.role]': '"img"',
    '[attr.aria-label]': 'ariaLabel || "Chart"',
    '[attr.tabindex]': '0',
    '[style.height]': 'heightStyle',
  },
  template: `<div #chartEl class="size-full"></div>`,
})
export class UiPolarBarChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  /** `{ category, value }` per spoke. */
  @Input() data: { category: string; value: number }[] = []
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
    const series = [
      {
        type: 'bar',
        coordinateSystem: 'polar',
        data: this.data.map((d) => d.value),
        colorBy: 'data',
        roundCap: true,
        itemStyle: { borderRadius: 6 },
      },
    ]
    const userOption: Record<string, any> = this.option ?? {}
    const {
      series: userSeries,
      polar: userPolar,
      angleAxis: userAngle,
      radiusAxis: userRadius,
      tooltip: userTooltip,
      legend: userLegend,
      ...userRest
    } = userOption
    const mergedSeries = Array.isArray(userSeries) ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) })) : series
    return {
      color: colors,
      polar: mergeOptionBlock({ radius: ['18%', '78%'] }, userPolar),
      angleAxis: mergeOptionBlock(
        { type: 'value', startAngle: 90, axisLabel: { color: getChartTextColor(), fontSize: 10 } },
        userAngle,
      ),
      radiusAxis: mergeOptionBlock(
        {
          type: 'category',
          data: this.data.map((d) => d.category),
          axisLabel: { color: getChartTextColor(), fontSize: 11 },
        },
        userRadius,
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
      legend:
        (userLegend as { show?: boolean } | undefined)?.show === false
          ? undefined
          : mergeOptionBlock({ show: false }, userLegend),
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
    use([CanvasRenderer, EChartsBarChart, comps.PolarComponent, comps.TooltipComponent, comps.LegendComponent])
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
