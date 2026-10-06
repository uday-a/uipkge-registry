import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
  booleanAttribute,
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
} from '../use-chart-theme'

/**
 * Angular port of the UIPKGE WaffleChart. The React/Vue source renders a dependency-free
 * SVG grid; this standalone port renders the same largest-remainder cell allocation as an
 * ECharts heatmap plus the same HTML legend. Inputs mirror React/Vue (`data`, `height`,
 * `size`, `radius`, `showLegend`, `colors`); `option` is the Angular ECharts escape hatch.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-waffle-chart, [ui-waffle-chart]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"waffle-chart"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
    '[attr.role]': '"img"',
    '[attr.aria-label]': 'effectiveAriaLabel',
    '[attr.tabindex]': '0',
    '[style.height]': 'heightStyle',
  },
  template: `
    <div #chartEl [class]="showLegend ? 'h-full min-w-0 flex-1' : 'size-full'"></div>
    @if (showLegend) {
      <ul class="shrink-0 space-y-1.5 text-xs">
        @for (d of data; track d.name; let i = $index) {
          <li class="flex items-center gap-2">
            <span class="size-2.5 rounded-[3px]" [style.background]="d.color ?? palette[i % palette.length]"></span>
            <span class="text-foreground font-medium">{{ d.name }}</span>
            <span class="text-muted-foreground tabular-nums">{{ pct(d.value) }}%</span>
          </li>
        }
      </ul>
    }
  `,
})
export class UiWaffleChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  /** `{ name, value, color? }` per slice. Cells allocate by largest remainder. */
  @Input() data: { name: string; value: number; color?: string }[] = []
  @Input() height: number | string = 260
  /** Cells per side (total = size²). Default 10. */
  @Input() size = 10
  /** Cell corner radius. Default 2. */
  @Input() radius = 2
  @Input({ transform: booleanAttribute }) showLegend = true
  /** Palette override. Defaults to chart-1..5 tokens. */
  @Input() colors?: string[]
  @Input() option?: Record<string, unknown>
  /** Accessible name announced for the chart image. Defaults to a generated "Waffle chart: …" summary. */
  @Input() ariaLabel?: string
  @Input('class') className?: string

  @ViewChild('chartEl', { static: false }) chartEl?: ElementRef<HTMLDivElement>

  private chart: echarts.ECharts | null = null
  private unsubscribeTheme: (() => void) | null = null

  get hostClass(): string {
    return cn(
      'block focus-visible:ring-ring w-full focus-visible:ring-2 focus-visible:outline-none',
      this.showLegend && 'flex items-center justify-center gap-5',
      this.className,
    )
  }

  get heightStyle(): string {
    return /^\d+$/.test(String(this.height)) ? `${this.height}px` : String(this.height)
  }

  /** Active palette: `colors` override wins, else the chart theme tokens. */
  get palette(): string[] {
    return this.colors ?? getChartColors()
  }

  total(): number {
    return this.data.reduce((s, d) => s + d.value, 0) || 1
  }

  pct(value: number): number {
    return Math.round((value / this.total()) * 100)
  }

  get effectiveAriaLabel(): string {
    if (this.ariaLabel) return this.ariaLabel
    const total = this.total()
    return `Waffle chart: ${this.data.map((d) => `${d.name} ${Math.round((d.value / total) * 100)}%`).join(', ')}`
  }

  /** size² cells `[col, row, itemIndex]`, row-major with the first slice at the bottom (mirrors React). Pure — unit-tested. */
  cells(): [number, number, number][] {
    const n = this.size * this.size
    const total = this.total()
    const quotas = this.data.map((d) => (d.value / total) * n)
    const base = quotas.map((q) => Math.floor(q))
    let rest = n - base.reduce((s, b) => s + b, 0)
    const order = quotas.map((q, i) => [q - base[i]!, i] as [number, number]).sort((a, b) => b[0] - a[0])
    for (const [, i] of order) {
      if (rest <= 0) break
      base[i]!++
      rest--
    }
    const cells: [number, number, number][] = []
    let k = 0
    base.forEach((count, item) => {
      for (let j = 0; j < count; j++) {
        cells.push([k % this.size, this.size - 1 - Math.floor(k / this.size), item])
        k++
      }
    })
    return cells
  }

  /** Build the merged ECharts option (pure — no DOM needed, unit-testable). */
  getOption(): Record<string, unknown> {
    const colors = this.palette
    const cells = this.cells()
    const series = [
      {
        type: 'heatmap',
        data: cells,
        itemStyle: {
          borderWidth: 2,
          borderRadius: this.radius,
          color: (p: { data: [number, number, number] }) => {
            const item = this.data[p.data[2]]
            return item?.color ?? colors[p.data[2] % colors.length]
          },
        },
        label: { show: false },
      },
    ]
    const userOption: Record<string, any> = this.option ?? {}
    const { series: userSeries, tooltip: userTooltip, ...userRest } = userOption
    const mergedSeries = Array.isArray(userSeries) ? series.map((s, i) => ({ ...s, ...(userSeries[i] ?? {}) })) : series
    return {
      color: colors,
      tooltip: {
        trigger: 'item',
        formatter: (p: { data: [number, number, number] }) => this.data[p.data[2]]?.name ?? '',
        backgroundColor: getChartTooltipBg(),
        borderColor: getChartTooltipBorder(),
        textStyle: { color: getChartTextColor(), fontSize: 12 },
        ...(typeof userTooltip === 'object' && userTooltip !== null ? userTooltip : {}),
      },
      xAxis: { type: 'category', show: false },
      yAxis: { type: 'category', show: false, inverse: true },
      // ECharts throws "Heatmap must use with visualMap" outside production builds, so every
      // `ng serve` failed. This one is hidden and only sets opacity: cells keep their own colours.
      visualMap: {
        show: false,
        type: 'piecewise',
        seriesIndex: 0,
        dimension: 2,
        pieces: [{ min: -Infinity }],
        inRange: { opacity: 1 },
      },
      series: mergedSeries,
      ...userRest,
    }
  }

  async ngAfterViewInit(): Promise<void> {
    if (typeof window === 'undefined' || !this.chartEl?.nativeElement) return
    const [{ use }, { CanvasRenderer }, { HeatmapChart: EChartsHeatmapChart }, comps] = await Promise.all([
      import('echarts/core'),
      import('echarts/renderers'),
      import('echarts/charts'),
      import('echarts/components'),
    ])
    use([CanvasRenderer, EChartsHeatmapChart, comps.TooltipComponent, comps.VisualMapComponent])
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
        changes['size'] ||
        changes['radius'] ||
        changes['colors'] ||
        changes['showLegend'])
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
