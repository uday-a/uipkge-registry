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
  getChartAxisColor,
  getChartColors,
  getChartSplitLineColor,
  getChartTextColor,
  getChartTooltipBg,
  getChartTooltipBorder,
  getChartTooltipText,
  mergeOptionBlock,
} from '../use-chart-theme'

export type HeatmapPoint = { x: string; y: string; value: number }
export type HeatmapDatum = [number, number, number] | HeatmapPoint

function isTuple(d: HeatmapDatum): d is [number, number, number] {
  return Array.isArray(d)
}

/**
 * Angular port of the UIPKGE Heatmap — category/category intensity
 * grid with a continuous visual map. Standalone, theme-aware.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-heatmap, [ui-heatmap]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"heatmap"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
    '[attr.role]': '"img"',
    '[attr.aria-label]': 'ariaLabel || "Chart"',
    '[attr.tabindex]': '0',
    '[style.height]': 'heightStyle',
  },
  template: `<div #chartEl class="size-full"></div>`,
})
export class UiHeatmapComponent implements AfterViewInit, OnChanges, OnDestroy {
  /** `[xIndex, yIndex, value]` tuples (React/Vue shape). `{ x, y, value }` objects also accepted. */
  @Input() data: HeatmapDatum[] = []
  @Input() xLabels: string[] = []
  @Input() yLabels: string[] = []
  /** @deprecated Use `xLabels`. Kept for backwards compatibility. */
  @Input() xCategories: string[] = []
  /** @deprecated Use `yLabels`. Kept for backwards compatibility. */
  @Input() yCategories: string[] = []
  /** Visual-map minimum. Defaults to data min. */
  @Input() min?: number
  /** Visual-map maximum. Defaults to data max. */
  @Input() max?: number
  @Input() height: number | string = 300
  @Input() option?: Record<string, unknown>
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  @Input() ariaLabel?: string
  @Input('class') className?: string

  resolvedX(): string[] {
    if (this.xLabels.length) return this.xLabels
    if (this.xCategories.length) return this.xCategories
    return [...new Set(this.data.filter((d): d is HeatmapPoint => !isTuple(d)).map((d) => d.x))]
  }

  resolvedY(): string[] {
    if (this.yLabels.length) return this.yLabels
    if (this.yCategories.length) return this.yCategories
    return [...new Set(this.data.filter((d): d is HeatmapPoint => !isTuple(d)).map((d) => d.y))]
  }

  /** Data normalized to `[xIndex, yIndex, value]` triples. Pure. */
  triples(): [number, number, number][] {
    const xCats = this.resolvedX()
    const yCats = this.resolvedY()
    return this.data.map((d) =>
      isTuple(d) ? d : [xCats.indexOf(d.x), yCats.indexOf(d.y), d.value],
    )
  }

  extent(): [number, number] {
    const values = this.triples().map((t) => t[2])
    const lo = this.min ?? (values.length ? Math.min(...values) : 0)
    const hi = this.max ?? (values.length ? Math.max(...values) : 1)
    return [lo, hi]
  }
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
    const xCats = this.resolvedX()
    const yCats = this.resolvedY()
    const [lo, hi] = this.extent()
    const values = this.triples()

    const userOption: Record<string, any> = this.option ?? {}
    const {
      series: userSeries,
      xAxis: userXAxis,
      yAxis: userYAxis,
      grid: userGrid,
      visualMap: userVisualMap,
      tooltip: userTooltip,
      ...userRest
    } = userOption

    return {
      color: colors,
      grid: mergeOptionBlock(
        { left: 16, right: 16, top: 24, bottom: 24, outerBoundsMode: 'same', outerBoundsContain: 'axisLabel' },
        userGrid,
      ),
      tooltip: mergeOptionBlock(
        {
          trigger: 'item',
          position: 'top',
          backgroundColor: getChartTooltipBg(),
          borderColor: getChartTooltipBorder(),
          textStyle: { color: getChartTooltipText(), fontSize: 12 },
          formatter: (params: { value: [number, number, number] }) =>
            `${yCats[params.value[1]]} / ${xCats[params.value[0]]}: ${params.value[2]}`,
        },
        userTooltip,
      ),
      xAxis: mergeOptionBlock(
        {
          type: 'category',
          data: xCats,
          axisLabel: { color: getChartTextColor(), fontSize: 11 },
          axisTick: { show: false },
          splitArea: { show: true },
        },
        userXAxis,
      ),
      yAxis: mergeOptionBlock(
        {
          type: 'category',
          data: yCats,
          axisLabel: { color: getChartTextColor(), fontSize: 11 },
          axisTick: { show: false },
          splitArea: { show: true },
        },
        userYAxis,
      ),
      visualMap: mergeOptionBlock(
        {
          min: lo,
          max: hi,
          calculable: true,
          orient: 'horizontal',
          left: 'center',
          bottom: 0,
          itemWidth: 12,
          itemHeight: 80,
          inRange: { color: [colors[0], colors[1], colors[2]] },
          textStyle: { fontSize: 10 },
        },
        userVisualMap,
      ),
      series: Array.isArray(userSeries)
        ? userSeries
        : [
            {
              type: 'heatmap',
              data: values,
              label: { show: false },
              itemStyle: { borderRadius: 2, borderWidth: 0 },
              emphasis: {
                itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.2)' },
              },
            },
          ],
      ...userRest,
    }
  }

  /** ECharts chart + component modules, resolved lazily so SSR never loads canvas code. */
  private chartModules(charts: Record<string, unknown>, comps: Record<string, unknown>): unknown[] {
    return [charts['HeatmapChart'], comps['GridComponent'], comps['TooltipComponent'], comps['VisualMapComponent']]
  }

  async ngAfterViewInit(): Promise<void> {
    if (typeof window === 'undefined' || !this.chartEl?.nativeElement) return
    const [{ use }, { CanvasRenderer }, charts, comps] = await Promise.all([
      import('echarts/core'),
      import('echarts/renderers'),
      import('echarts/charts'),
      import('echarts/components'),
    ])
    use([CanvasRenderer, ...(this.chartModules(charts, comps) as never[])])
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
    if (this.chart && Object.keys(changes).length) {
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
