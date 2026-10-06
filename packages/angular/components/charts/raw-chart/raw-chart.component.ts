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
import { getChartColors } from '../use-chart-theme'

/**
 * Angular port of the UIPKGE RawChart — escape hatch passing a full ECharts option straight through. Standalone. Same inputs as the Vue `RawChart` (`option`, `height`).
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-raw-chart, [ui-raw-chart]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"raw-chart"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
    '[attr.role]': '"img"',
    '[attr.aria-label]': 'ariaLabel || "Chart"',
    '[attr.tabindex]': '0',
    '[style.height]': 'heightStyle',
  },
  template: `<div #chartEl class="size-full"></div>`,
})
export class UiRawChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  /** Full ECharts option passed straight through. */
  @Input() rawOption: Record<string, unknown> = {}
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
    const userOption: Record<string, any> = this.option ?? {}
    return {
      color: getChartColors(),
      ...this.rawOption,
      ...userOption,
    }
  }

  async ngAfterViewInit(): Promise<void> {
    if (typeof window === 'undefined' || !this.chartEl?.nativeElement) return
    const [
      { use },
      { CanvasRenderer },
      {
        BarChart: EChartsBarChart,
        LineChart: EChartsLineChart,
        PieChart: EChartsPieChart,
        ScatterChart: EChartsScatterChart,
      },
      comps,
    ] = await Promise.all([
      import('echarts/core'),
      import('echarts/renderers'),
      import('echarts/charts'),
      import('echarts/components'),
    ])
    use([
      CanvasRenderer,
      EChartsBarChart,
      EChartsLineChart,
      EChartsPieChart,
      EChartsScatterChart,
      comps.GridComponent,
      comps.TooltipComponent,
      comps.LegendComponent,
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
    if (this.chart && (changes['option'] || changes['rawOption'])) {
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
