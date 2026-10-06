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
  getChartSplitLineColor,
  getChartTooltipBg,
  getChartTooltipBorder,
  getChartTooltipText,
  mergeOptionBlock,
} from '../use-chart-theme'

/**
 * Angular port of the UIPKGE QuadrantChart — median-split scatter with labelled quadrants. Standalone, theme-aware. Same inputs as the Vue `QuadrantChart` (`data`, `xMid`, `yMid`, `quadrantLabels`, `xName`, `yName`, `height`, `option`).
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-quadrant-chart, [ui-quadrant-chart]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"quadrant-chart"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
    '[attr.role]': '"img"',
    '[attr.aria-label]': 'ariaLabel || "Chart"',
    '[attr.tabindex]': '0',
    '[style.height]': 'heightStyle',
  },
  template: `<div #chartEl class="size-full"></div>`,
})
export class UiQuadrantChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  /** `{ x, y, label? }` per point. */
  @Input() data: { x: number; y: number; label?: string }[] = []
  /** Split lines. Default to the data medians. */
  @Input() xMid?: number
  @Input() yMid?: number
  /** Clockwise from top-right: [stars, question marks, dogs, cash cows]. */
  @Input() quadrantLabels: [string, string, string, string] = ['Stars', 'Question marks', 'Dogs', 'Cash cows']
  @Input() xName?: string
  @Input() yName?: string
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
  /** Median split point. Pure — unit-tested. */
  medians(): { mx: number; my: number } {
    const mid = (vals: number[]): number => {
      const s = [...vals].sort((a, b) => a - b)
      const m = Math.floor(s.length / 2)
      return s.length % 2 ? (s[m] ?? 0) : ((s[m - 1] ?? 0) + (s[m] ?? 0)) / 2
    }
    return { mx: mid(this.data.map((d) => d.x)), my: mid(this.data.map((d) => d.y)) }
  }

  /** Build the merged ECharts option (pure — no DOM needed, unit-testable). */
  getOption(): Record<string, unknown> {
    const colors = getChartColors()
    const { mx, my } = this.medians()
    const x = this.xMid ?? mx
    const y = this.yMid ?? my
    const quad = (name: string, x0: number | string, x1: number | string, y0: number | string, y1: number | string) => [
      {
        xAxis: x0,
        yAxis: y0,
        itemStyle: { color: colors[0], opacity: 0.05 },
        label: {
          show: true,
          position: 'inside',
          color: getChartTextColor(),
          fontSize: 12,
          fontWeight: 700,
          formatter: name,
        },
      },
      { xAxis: x1, yAxis: y1 },
    ]
    const series = [
      {
        type: 'scatter',
        symbolSize: 12,
        itemStyle: { color: colors[0], opacity: 0.85 },
        label: {
          show: true,
          position: 'top',
          color: getChartTextColor(),
          fontSize: 10,
          formatter: (p: { value: (number | string)[] }) => p.value[2] ?? '',
        },
        markLine: {
          silent: true,
          symbol: 'none',
          lineStyle: { type: 'dashed', color: getChartTextColor(), opacity: 0.6 },
          label: { show: false },
          data: [{ xAxis: x }, { yAxis: y }],
        },
        markArea: {
          silent: true,
          data: [
            quad(this.quadrantLabels[0], x, 'max', y, 'max'),
            quad(this.quadrantLabels[1], 'min', x, y, 'max'),
            quad(this.quadrantLabels[2], 'min', x, 'min', y),
            quad(this.quadrantLabels[3], x, 'max', 'min', y),
          ],
        },
        data: this.data.map((d) => [d.x, d.y, d.label ?? '']),
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
    const xs = this.data.map((d) => d.x)
    const ys = this.data.map((d) => d.y)
    return {
      color: colors,
      grid: mergeOptionBlock({ left: 16, right: 16, top: 24, bottom: 24, containLabel: true }, userGrid),
      tooltip: mergeOptionBlock(
        {
          trigger: 'item',
          backgroundColor: getChartTooltipBg(),
          borderColor: getChartTooltipBorder(),
          textStyle: { color: getChartTooltipText(), fontSize: 12 },
        },
        userTooltip,
      ),
      legend: { show: false },
      xAxis: mergeOptionBlock(
        {
          type: 'value',
          name: this.xName,
          min: Math.min(...xs) - 1,
          max: Math.max(...xs) + 1,
          nameTextStyle: { color: getChartTextColor(), fontSize: 10 },
          splitLine: { lineStyle: { color: getChartSplitLineColor() } },
          axisLabel: { color: getChartTextColor(), fontSize: 11 },
        },
        userXAxis,
      ),
      yAxis: mergeOptionBlock(
        {
          type: 'value',
          name: this.yName,
          min: Math.min(...ys) - 1,
          max: Math.max(...ys) + 1,
          nameTextStyle: { color: getChartTextColor(), fontSize: 10 },
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
    use([
      CanvasRenderer,
      EChartsScatterChart,
      comps.GridComponent,
      comps.TooltipComponent,
      comps.MarkLineComponent,
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
        changes['quadrantLabels'] ||
        changes['xMid'] ||
        changes['yMid'] ||
        changes['xName'] ||
        changes['yName'])
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
