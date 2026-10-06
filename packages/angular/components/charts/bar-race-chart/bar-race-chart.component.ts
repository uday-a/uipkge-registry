import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
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

export interface RaceFrame {
  /** Frame caption, e.g. a year. */
  label: string
  values: { category: string; value: number }[]
}

/**
 * Angular port of the UIPKGE BarRaceChart — ranked frames rendered as horizontal bars that
 * auto-advance at runtime with smooth resorting. Standalone, theme-aware. Same inputs as the
 * React/Vue `BarRaceChart` (`frames`, `topN`, `autoPlay`, `interval`, `height`, `option`).
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-bar-race-chart, [ui-bar-race-chart]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"bar-race-chart"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
    '[attr.role]': '"img"',
    '[attr.aria-label]': 'accessibleLabel',
    '[attr.tabindex]': '0',
    '[style.height]': 'heightStyle',
  },
  template: `<div #chartEl class="size-full"></div>`,
})
export class UiBarRaceChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  /** Ranked frames: `{ label, values: { category, value }[] }`. */
  @Input() frames: RaceFrame[] = []
  /** Rows shown per frame. Default 8. */
  @Input() topN = 8
  /** Auto-advance frames at runtime. Default true. */
  @Input() autoPlay = true
  /** ms between frames. Default 1400. */
  @Input() interval = 1400
  @Input() height: number | string = 380
  @Input() option?: Record<string, unknown>
  /** Accessible name announced for the chart image. Defaults to "Bar race chart, frame <label>". */
  @Input() ariaLabel?: string
  @Input('class') className?: string

  @ViewChild('chartEl', { static: false }) chartEl?: ElementRef<HTMLDivElement>

  private chart: echarts.ECharts | null = null
  private unsubscribeTheme: (() => void) | null = null
  private timer: ReturnType<typeof setInterval> | undefined
  private cursor = 0

  private cdr?: ChangeDetectorRef

  constructor() {
    try {
      this.cdr = inject(ChangeDetectorRef, { optional: true }) ?? undefined
    } catch {
      // Instantiated outside injection context (e.g. unit tests)
    }
  }

  get hostClass(): string {
    return cn('block focus-visible:ring-ring w-full focus-visible:ring-2 focus-visible:outline-none', this.className)
  }

  get heightStyle(): string {
    return /^\d+$/.test(String(this.height)) ? `${this.height}px` : String(this.height)
  }

  currentFrame(): RaceFrame {
    return this.frames[Math.min(this.cursor, this.frames.length - 1)] ?? { label: '', values: [] }
  }

  get accessibleLabel(): string {
    return this.ariaLabel || `Bar race chart, frame ${this.currentFrame().label}`
  }

  /** Build the merged ECharts option for the current frame (pure — no DOM needed, unit-testable). */
  getOption(): Record<string, unknown> {
    const frame = this.currentFrame()
    const rows = [...frame.values]
      .sort((a, b) => b.value - a.value)
      .slice(0, this.topN)
      .reverse()
    const colors = getChartColors()
    const max = Math.max(...rows.map((r) => r.value), 1)
    const series = [
      {
        type: 'bar',
        barWidth: 16,
        realtimeSort: true,
        itemStyle: { color: colors[0], borderRadius: [6, 6, 6, 6] },
        label: { show: true, position: 'right', color: getChartTextColor(), fontSize: 11, fontWeight: 600 },
        data: rows.map((r) => r.value),
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
      animationDurationUpdate: 900,
      animationEasingUpdate: 'quinticInOut',
      graphic: {
        elements: [
          {
            type: 'text',
            right: 16,
            bottom: 8,
            style: { text: frame.label, fontSize: 44, fontWeight: 800, fill: getChartAxisColor() },
          },
        ],
      },
      grid: mergeOptionBlock(
        { left: 16, right: 64, top: 16, bottom: 24, outerBoundsMode: 'same', outerBoundsContain: 'axisLabel' },
        userGrid,
      ),
      tooltip: mergeOptionBlock(
        {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
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
          max: max * 1.25,
          splitLine: { lineStyle: { color: getChartSplitLineColor() } },
          axisLabel: { color: getChartTextColor(), fontSize: 11 },
        },
        userXAxis,
      ),
      yAxis: mergeOptionBlock(
        {
          type: 'category',
          inverse: true,
          data: rows.map((r) => r.category),
          axisLine: { show: false },
          axisLabel: { color: getChartTextColor(), fontSize: 11, fontWeight: 600 },
          axisTick: { show: false },
          animationDuration: 300,
          animationDurationUpdate: 300,
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
    use([
      CanvasRenderer,
      EChartsBarChart,
      comps.GridComponent,
      comps.TooltipComponent,
      comps.GraphicComponent,
      comps.LegendComponent,
    ])
    const { init } = await import('echarts/core')
    this.chart = init(this.chartEl.nativeElement)
    this.chart.setOption(this.getOption())
    const { onChartThemeChange } = await import('../use-chart-theme')
    this.unsubscribeTheme = onChartThemeChange(() => this.chart?.setOption(this.getOption()))
    this.restartTimer()
    if (typeof ResizeObserver !== 'undefined') {
      new ResizeObserver(() => this.chart?.resize()).observe(this.chartEl.nativeElement)
    }
  }

  private restartTimer(): void {
    clearInterval(this.timer)
    this.timer = undefined
    if (!this.autoPlay || this.frames.length < 2 || this.interval <= 0) return
    this.timer = setInterval(() => {
      this.cursor = (this.cursor + 1) % this.frames.length
      this.chart?.setOption(this.getOption())
      this.cdr?.markForCheck()
    }, this.interval)
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['autoPlay'] || changes['interval'] || changes['frames']) this.restartTimer()
    if (
      this.chart &&
      (changes['frames'] || changes['topN'] || changes['option'] || changes['autoPlay'] || changes['interval'])
    ) {
      this.chart.setOption(this.getOption())
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.timer)
    this.timer = undefined
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
