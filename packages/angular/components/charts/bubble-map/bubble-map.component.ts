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

export interface MapBubble {
  id: string
  name: string
  lat: number
  lng: number
  value: number
  formattedValue?: string
  category?: string
  status?: 'optimal' | 'warning' | 'destructive' | 'neutral' | 'active'
  color?: string
  pulse?: boolean
  description?: string
}

const STATUS_COLORS: Record<string, string> = {
  optimal: 'oklch(0.65 0.20 145)',
  active: 'oklch(0.60 0.20 250)',
  warning: 'oklch(0.75 0.18 65)',
  destructive: 'oklch(0.60 0.22 25)',
  neutral: 'oklch(0.65 0.05 240)',
}

function getBubbleColor(b: MapBubble): string {
  if (b.color) return b.color
  if (b.status && STATUS_COLORS[b.status]) return STATUS_COLORS[b.status]
  return 'oklch(0.60 0.20 250)'
}

/**
 * Angular port of the UIPKGE BubbleMap. React/Vue render Mapbox-backed proportional symbols with legend, selection and projection controls; this standalone port renders a dependency-free ECharts scatter overview (no Mapbox token needed) with the same square-root area normalization in a pure getOption(). Shared inputs: `bubbles`, `minRadius`, `maxRadius`. The Mapbox-only inputs (`showLegend`, `legendTitle`, `selectedId`, `interactive`, `projection`, `variant`, `center`, `zoom`) and selection outputs are intentionally dropped; `height` / `option` / `ariaLabel` follow the other Angular ECharts ports.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-bubble-map, [ui-bubble-map]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"bubble-map"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
    '[attr.role]': '"img"',
    '[attr.aria-label]': 'ariaLabel || "Chart"',
    '[attr.tabindex]': '0',
    '[style.height]': 'heightStyle',
  },
  template: `<div #chartEl class="size-full"></div>`,
})
export class UiBubbleMapComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() bubbles: MapBubble[] = []
  @Input() minRadius = 10
  @Input() maxRadius = 42
  @Input() height: number | string = 420
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
  radiusFor(v: number, max: number): number {
    return this.minRadius + Math.sqrt(max > 0 ? v / max : 0) * (this.maxRadius - this.minRadius)
  }

  /** Build the merged ECharts option (pure — no DOM needed, unit-testable). */
  getOption(): Record<string, unknown> {
    const colors = getChartColors()
    const max = Math.max(...this.bubbles.map((b) => b.value), 1)
    const series = [
      {
        type: 'scatter',
        data: this.bubbles.map((b) => ({
          name: b.name,
          value: [b.lng, b.lat, b.value],
          symbolSize: this.radiusFor(b.value, max) * 2,
          itemStyle: { color: getBubbleColor(b), opacity: 0.8 },
        })),
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
        { left: 16, right: 16, top: 16, bottom: 16, outerBoundsMode: 'same', outerBoundsContain: 'axisLabel' },
        userGrid,
      ),
      tooltip: mergeOptionBlock(
        {
          trigger: 'item',
          formatter: '{b}: {c}',
          backgroundColor: getChartTooltipBg(),
          borderColor: getChartTooltipBorder(),
          textStyle: { color: getChartTooltipText(), fontSize: 12 },
        },
        userTooltip,
      ),
      xAxis: mergeOptionBlock(
        { type: 'value', min: -180, max: 180, axisLabel: { color: getChartTextColor(), fontSize: 11 } },
        userXAxis,
      ),
      yAxis: mergeOptionBlock(
        { type: 'value', min: -90, max: 90, axisLabel: { color: getChartTextColor(), fontSize: 11 } },
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
    use([CanvasRenderer, EChartsScatterChart, comps.GridComponent, comps.TooltipComponent])
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
      (changes['data'] || changes['option'] || changes['bubbles'] || changes['minRadius'] || changes['maxRadius'])
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
