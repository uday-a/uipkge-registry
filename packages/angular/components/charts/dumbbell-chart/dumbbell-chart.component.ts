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
 * Angular port of the UIPKGE DumbbellChart — before/after dots joined per category via a custom series. Standalone, theme-aware. Same inputs as the React/Vue `DumbbellChart` (`data`, `names`, `height`, `option`).
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-dumbbell-chart, [ui-dumbbell-chart]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"dumbbell-chart"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
    '[attr.role]': '"img"',
    '[attr.aria-label]': 'ariaLabel || "Chart"',
    '[attr.tabindex]': '0',
    '[style.height]': 'heightStyle',
  },
  template: `<div #chartEl class="size-full"></div>`,
})
export class UiDumbbellChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  /** One row per category: compare `a` vs `b`. */
  @Input() data: { label: string; a: number; b: number }[] = []
  /** Series names for [a, b]. Default ['Before', 'After']. */
  @Input() names: [string, string] = ['Before', 'After']
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
    const colorA = colors[2]!
    const colorB = colors[0]!
    const axis = getChartAxisColor()
    const series = [
      {
        type: 'custom',
        renderItem: (
          params: { dataIndex: number },
          api: { coord: (p: number[]) => number[]; value: (i: number) => number },
        ) => {
          const y = api.coord([0, params.dataIndex])[1]!
          const a = api.coord([api.value(0), params.dataIndex])
          const b = api.coord([api.value(1), params.dataIndex])
          return {
            type: 'group',
            children: [
              { type: 'line', shape: { x1: a[0], y1: y, x2: b[0], y2: y }, style: { stroke: axis, lineWidth: 2 } },
              { type: 'circle', shape: { cx: a[0], cy: y, r: 6 }, style: { fill: colorA } },
              { type: 'circle', shape: { cx: b[0], cy: y, r: 6 }, style: { fill: colorB } },
            ],
          }
        },
        data: this.data.map((d) => [d.a, d.b]),
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
    const rows = this.data
    const names = this.names
    return {
      color: colors,
      grid: mergeOptionBlock(
        { left: 16, right: 16, top: 32, bottom: 24, outerBoundsMode: 'same', outerBoundsContain: 'axisLabel' },
        userGrid,
      ),
      tooltip: mergeOptionBlock(
        {
          trigger: 'item',
          backgroundColor: getChartTooltipBg(),
          borderColor: getChartTooltipBorder(),
          textStyle: { color: getChartTooltipText(), fontSize: 12 },
          formatter: (p: { dataIndex: number; value: [number, number] }) =>
            `${rows[p.dataIndex]?.label}<br/>${names[0]}: ${p.value[0]}<br/>${names[1]}: ${p.value[1]}`,
        },
        userTooltip,
      ),
      legend: {
        bottom: 0,
        icon: 'circle',
        itemWidth: 8,
        itemHeight: 8,
        textStyle: { fontSize: 11, color: getChartTextColor() },
        data: [
          { name: names[0], itemStyle: { color: colorA } },
          { name: names[1], itemStyle: { color: colorB } },
        ],
      },
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
          inverse: true,
          data: rows.map((d) => d.label),
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
    const [{ use }, { CanvasRenderer }, { CustomChart: EChartsCustomChart }, comps] = await Promise.all([
      import('echarts/core'),
      import('echarts/renderers'),
      import('echarts/charts'),
      import('echarts/components'),
    ])
    use([CanvasRenderer, EChartsCustomChart, comps.GridComponent, comps.TooltipComponent, comps.LegendComponent])
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
