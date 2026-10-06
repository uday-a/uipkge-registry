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

export interface IcicleNode {
  name: string
  value?: number
  children?: IcicleNode[]
}

export interface IcicleFlatNode {
  x0: number
  x1: number
  depth: number
  name: string
  value: number
  color: number
}

/**
 * Angular port of the UIPKGE IcicleChart — top-down rect partition via a custom series (ECharts ships no icicle). Standalone, theme-aware. Same inputs as the Vue `IcicleChart` (`data`, `height`, `option`).
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-icicle-chart, [ui-icicle-chart]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"icicle-chart"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
    '[attr.role]': '"img"',
    '[attr.aria-label]': 'ariaLabel || "Chart"',
    '[attr.tabindex]': '0',
    '[style.height]': 'heightStyle',
  },
  template: `<div #chartEl class="size-full"></div>`,
})
export class UiIcicleChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  /** Root of the hierarchy. Children subdivide their parent proportionally. */
  @Input() data?: IcicleNode
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
  /**
   * Partition layout: each level fills 0..100, children subdivide their parent
   * proportionally (equal shares when values are absent). Pure — unit-testable.
   */
  flatten(): IcicleFlatNode[] {
    const out: IcicleFlatNode[] = []
    const walk = (node: IcicleNode | undefined, x0: number, x1: number, depth: number, color: number): void => {
      if (!node || typeof node !== 'object') return
      const kids = node.children ?? []
      const value =
        node.value ?? kids.reduce((s, k) => s + (k.value ?? k.children?.reduce((a, c) => a + (c.value ?? 0), 0) ?? 0), 0)
      out.push({ x0, x1, depth, name: node.name, value, color })
      if (!kids.length) return
      const total = kids.reduce((s, k) => s + (k.value ?? 0), 0)
      let x = x0
      kids.forEach((k, i) => {
        const w = total > 0 ? ((k.value ?? 0) / total) * (x1 - x0) : (x1 - x0) / kids.length
        walk(k, x, x + w, depth + 1, depth === 0 ? i : color)
        x += w
      })
    }
    walk(this.data, 0, 100, 0, 0)
    return out
  }

  /** Build the merged ECharts option (pure — no DOM needed, unit-testable). */
  getOption(): Record<string, unknown> {
    const colors = getChartColors()
    const flat = this.flatten()
    const maxDepth = Math.max(...flat.map((n) => n.depth), 0)
    const grand = flat[0]?.value ?? 1
    const series = [
      {
        type: 'custom',
        renderItem: (params: { dataIndex: number }, api: { coord: (p: number[]) => number[] }) => {
          const n = flat[params.dataIndex]!
          const [px0, py0] = api.coord([n.x0, n.depth + 0.08])
          const [px1, py1] = api.coord([n.x1, n.depth + 0.92])
          const wide = Math.abs(px1! - px0!) > 48
          const children: Record<string, unknown>[] = [
            {
              type: 'rect',
              shape: {
                x: Math.min(px0!, px1!),
                y: Math.min(py0!, py1!),
                width: Math.max(1, Math.abs(px1! - px0!)),
                height: Math.abs(py1! - py0!),
                r: 3,
              },
              style: { fill: colors[n.color % colors.length], opacity: n.depth === 0 ? 0.35 : 0.85 },
            },
          ]
          if (wide) {
            children.push({
              type: 'text',
              style: {
                x: (px0! + px1!) / 2,
                y: (py0! + py1!) / 2,
                text: n.depth === 0 ? n.name : `${n.name} ${n.value}`,
                fill: n.depth === 0 ? getChartTextColor() : '#fff',
                fontSize: 11,
                fontWeight: n.depth === 0 ? 700 : 600,
                align: 'center',
                verticalAlign: 'middle',
                overflow: 'truncate',
                width: Math.abs(px1! - px0!) - 12,
              },
            })
          }
          return { type: 'group', children }
        },
        data: flat.map((n) => [n.x0, n.depth, n.x1]),
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
      grid: mergeOptionBlock({ left: 8, right: 8, top: 12, bottom: 12, containLabel: false }, userGrid),
      tooltip: mergeOptionBlock(
        {
          trigger: 'item',
          backgroundColor: getChartTooltipBg(),
          borderColor: getChartTooltipBorder(),
          textStyle: { color: getChartTooltipText(), fontSize: 12 },
          formatter: (p: { dataIndex: number }) => {
            const n: IcicleFlatNode | undefined = flat[p.dataIndex]
            return n
              ? `${n.name}<br/>${n.value.toLocaleString()} t (${((n.value / (grand || 1)) * 100).toFixed(1)}%)`
              : ''
          },
        },
        userTooltip,
      ),
      xAxis: mergeOptionBlock({ type: 'value', min: 0, max: 100, show: false }, userXAxis),
      yAxis: mergeOptionBlock(
        { type: 'value', min: -0.2, max: maxDepth + 1.1, inverse: true, show: false },
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
    use([CanvasRenderer, EChartsCustomChart, comps.GridComponent, comps.TooltipComponent])
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
