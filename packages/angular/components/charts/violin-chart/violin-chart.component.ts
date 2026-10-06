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
 * Angular port of the UIPKGE ViolinChart — Gaussian-KDE density violins with quartile boxes. Standalone, theme-aware. Same inputs as the React/Vue `ViolinChart` (`groups`, `height`, `option`).
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-violin-chart, [ui-violin-chart]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"violin-chart"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
    '[attr.role]': '"img"',
    '[attr.aria-label]': 'ariaLabel || "Chart"',
    '[attr.tabindex]': '0',
    '[style.height]': 'heightStyle',
  },
  template: `<div #chartEl class="size-full"></div>`,
})
export class UiViolinChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  /** `{ group, values: number[] }` per violin. */
  @Input() groups: { group: string; values: number[] }[] = []
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
  /** Gaussian KDE sampled at 40 points. Pure — unit-tested. */
  kde(values: number[]): { x: number; y: number }[] {
    const n = 40
    if (!values.length) return []
    const min = Math.min(...values)
    const max = Math.max(...values)
    const span = max - min || 1
    const mean = values.reduce((s, v) => s + v, 0) / values.length
    const sd = Math.sqrt(values.reduce((s, v) => s + (v - mean) ** 2, 0) / values.length) || span / 4
    const h = 1.06 * sd * Math.pow(values.length, -0.2)
    const pts: { x: number; y: number }[] = []
    for (let i = 0; i < n; i++) {
      const x = min - span * 0.1 + (span * 1.2 * i) / (n - 1)
      const y = values.reduce((s, v) => s + Math.exp(-0.5 * ((x - v) / h) ** 2), 0) / (values.length * h * 2.5066)
      pts.push({ x: +x.toFixed(3), y: +y.toFixed(4) })
    }
    return pts
  }

  quartiles(values: number[]): { q1: number; median: number; q3: number } {
    const s = [...values].sort((a, b) => a - b)
    if (!s.length) return { q1: 0, median: 0, q3: 0 }
    const q = (p: number): number => {
      const pos = (s.length - 1) * p
      const base = Math.floor(pos)
      return s[base]! + ((s[base + 1] ?? s[base]!) - s[base]!) * (pos - base)
    }
    return { q1: q(0.25), median: q(0.5), q3: q(0.75) }
  }

  /** Build the merged ECharts option (pure — no DOM needed, unit-testable). */
  getOption(): Record<string, unknown> {
    const colors = getChartColors()
    const names = this.groups.map((d) => d.group)
    const maxD = Math.max(...this.groups.flatMap((d) => this.kde(d.values).map((p) => p.y)), 0.001)
    const violin = (gi: number, curve: { x: number; y: number }[], color: string) => ({
      type: 'custom',
      renderItem: (params: unknown, api: { coord: (p: number[]) => number[] }) => {
        const pts = curve.map((p) => api.coord([gi + (p.y / maxD) * 0.42, p.x]))
        const mirrored = [...curve].reverse().map((p) => api.coord([gi - (p.y / maxD) * 0.42, p.x]))
        return { type: 'polygon', shape: { points: [...pts, ...mirrored] }, style: { fill: color, opacity: 0.55 } }
      },
      data: curve.map((p) => [p.x, p.y]),
    })
    const series = [
      ...this.groups.map((d, gi) => ({
        name: d.group,
        ...violin(gi, this.kde(d.values), colors[gi % colors.length]!),
      })),
      {
        name: 'quartiles',
        type: 'boxplot',
        itemStyle: { color: 'transparent', borderColor: getChartAxisColor(), borderWidth: 1.5 },
        data: this.groups.map((d) => {
          const { q1, median, q3 } = this.quartiles(d.values)
          const lo = Math.min(...d.values, q1)
          const hi = Math.max(...d.values, q3)
          return [lo, q1, median, q3, hi]
        }),
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
          trigger: 'item',
          backgroundColor: getChartTooltipBg(),
          borderColor: getChartTooltipBorder(),
          textStyle: { color: getChartTooltipText(), fontSize: 12 },
        },
        userTooltip,
      ),
      xAxis: mergeOptionBlock(
        {
          type: 'category',
          data: names,
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
    const [
      { use },
      { CanvasRenderer },
      { CustomChart: EChartsCustomChart, BoxplotChart: EChartsBoxplotChart, ScatterChart: EChartsScatterChart },
      comps,
    ] = await Promise.all([
      import('echarts/core'),
      import('echarts/renderers'),
      import('echarts/charts'),
      import('echarts/components'),
    ])
    use([
      CanvasRenderer,
      EChartsCustomChart,
      EChartsBoxplotChart,
      EChartsScatterChart,
      comps.GridComponent,
      comps.TooltipComponent,
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
    if (this.chart && (changes['groups'] || changes['option'])) {
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
