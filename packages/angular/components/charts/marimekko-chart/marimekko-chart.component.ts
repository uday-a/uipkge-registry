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

export interface MekkoColumn {
  name: string
  values: { name: string; value: number }[]
}

interface MekkoRect {
  x0: number
  x1: number
  y0: number
  y1: number
  name: string
  value: number
  column: string
  firstInColumn: boolean
}

/**
 * Angular port of the UIPKGE MarimekkoChart — column widths encode totals, stacked segments encode shares. Standalone, theme-aware. Same inputs as the React/Vue `MarimekkoChart` (`columns`, `height`, `option`).
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-marimekko-chart, [ui-marimekko-chart]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"marimekko-chart"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
    '[attr.role]': '"img"',
    '[attr.aria-label]': 'ariaLabel || "Marimekko chart"',
    '[attr.tabindex]': '0',
    '[style.height]': 'heightStyle',
  },
  template: `<div #chartEl class="size-full"></div>`,
})
export class UiMarimekkoChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  /** Columns `{ name, values: { name, value }[] }`. */
  @Input() columns: MekkoColumn[] = []
  @Input() height: number | string = 340
  @Input() option?: Record<string, unknown>
  /** Accessible name announced for the chart image. Defaults to "Marimekko chart". */
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

  /** Segment names in first-seen order — drives stable palette assignment. Pure. */
  segments(): string[] {
    return Array.from(new Set(this.columns.flatMap((c) => c.values.map((v) => v.name))))
  }

  /**
   * Mosaic tiles in 100x100 value space: column widths ∝ column totals (x),
   * segment heights ∝ within-column shares (y, stacked bottom-up). Pure.
   */
  tiles(): MekkoRect[] {
    const grand = this.columns.reduce((s, c) => s + c.values.reduce((a, v) => a + v.value, 0), 0) || 1
    let x = 0
    return this.columns.flatMap((c) => {
      const total = c.values.reduce((s, v) => s + v.value, 0)
      const w = (total / grand) * 100
      let y = 0
      const rects = c.values.map((v, vi) => {
        const h = total ? (v.value / total) * 100 : 0
        const rect: MekkoRect = {
          x0: x,
          x1: x + w,
          y0: y,
          y1: y + h,
          name: v.name,
          value: v.value,
          column: c.name,
          firstInColumn: vi === 0,
        }
        y += h
        return rect
      })
      x += w
      return rects
    })
  }

  /** Build the merged ECharts option (pure — no DOM needed, unit-testable). */
  getOption(): Record<string, unknown> {
    const colors = getChartColors()
    const textColor = getChartTextColor()
    const flat = this.tiles()
    const segNames = this.segments()
    const series = [
      {
        type: 'custom',
        renderItem: (params: { dataIndex: number }, api: { coord: (p: number[]) => number[] }) => {
          const s = flat[params.dataIndex]!
          const [px0, py1] = api.coord([s.x0, s.y1])
          const [px1, py0] = api.coord([s.x1, s.y0])
          const color = colors[segNames.indexOf(s.name) % colors.length]
          const w = Math.abs(px1! - px0!)
          const h = Math.abs(py1! - py0!)
          const children: Record<string, unknown>[] = [
            {
              type: 'rect',
              shape: {
                x: Math.min(px0!, px1!),
                y: Math.min(py0!, py1!),
                width: Math.max(1, w),
                height: Math.max(1, h),
                r: 2,
              },
              style: { fill: color },
            },
          ]
          if (w > 48 && h > 20) {
            children.push({
              type: 'text',
              style: {
                x: (px0! + px1!) / 2,
                y: (py0! + py1!) / 2,
                text: `${s.name} ${Math.round(s.y1 - s.y0)}%`,
                fill: '#fff',
                fontSize: 10,
                fontWeight: 600,
                align: 'center',
                verticalAlign: 'middle',
              },
            })
          }
          if (s.firstInColumn && w > 30) {
            const [lx] = api.coord([(s.x0 + s.x1) / 2, 0])
            const [, ly] = api.coord([0, -5])
            children.push({
              type: 'text',
              style: {
                x: lx,
                y: ly,
                text: `${s.column} (${Math.round(s.x1 - s.x0)}%)`,
                fill: textColor,
                fontSize: 10,
                fontWeight: 600,
                align: 'center',
                verticalAlign: 'middle',
              },
            })
          }
          return { type: 'group', children }
        },
        data: flat.map((s) => [s.x0, s.y0, s.x1, s.y1]),
      },
    ]
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
      grid: mergeOptionBlock({ left: 8, right: 8, top: 16, bottom: 36, containLabel: false }, userGrid),
      tooltip: mergeOptionBlock(
        {
          trigger: 'item',
          backgroundColor: getChartTooltipBg(),
          borderColor: getChartTooltipBorder(),
          textStyle: { color: getChartTooltipText(), fontSize: 12 },
          formatter: (p: { dataIndex: number }) => {
            const s: MekkoRect | undefined = flat[p.dataIndex]
            return s ? `${s.column} · ${s.name}<br/>${s.value} (${Math.round(s.x1 - s.x0)}% of width)` : ''
          },
        },
        userTooltip,
      ),
      legend: mergeOptionBlock(
        {
          bottom: 0,
          icon: 'circle',
          itemWidth: 8,
          itemHeight: 8,
          textStyle: { fontSize: 11, color: textColor },
          data: segNames,
        },
        userLegend,
      ),
      xAxis: mergeOptionBlock({ type: 'value', min: 0, max: 100, show: false }, userXAxis),
      yAxis: mergeOptionBlock({ type: 'value', min: -12, max: 100, show: false }, userYAxis),
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
    if (this.chart && (changes['columns'] || changes['option'])) {
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
