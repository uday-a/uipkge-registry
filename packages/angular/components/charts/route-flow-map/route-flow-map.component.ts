import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
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

export interface RouteHub {
  id: string
  name: string
  city?: string
  lat: number
  lng: number
  status?: 'optimal' | 'busy' | 'delayed' | string
  latency?: string | number
  color?: string
}

export interface FlightRoute {
  id: string
  from: string
  to: string
  callsign?: string
  aircraft?: string
  speed?: string
  altitude?: string
  progress?: number
  eta?: string
  status?: 'en-route' | 'scheduled' | 'approaching' | 'diverted' | string
  color?: string
  vehicleType?: 'plane' | 'ship' | 'packet' | 'pulse' | 'dot'
  duration?: number
  curvature?: number
}

/**
 * Angular port of the UIPKGE RouteFlowMap. React/Vue render a Mapbox globe; this
 * standalone port encodes the same hubs + curved flows in a pure getOption()
 * ECharts lines/scatter overview, so the globe-only inputs (`projection`,
 * `showGraticule`, `showHubLabels`, `interactive`) are intentionally dropped.
 * Hub/route telemetry shapes, `selectedRoute` + selection outputs, `height`
 * and `ariaLabel` match React/Vue.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-route-flow-map, [ui-route-flow-map]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"route-flow-map"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
    '[attr.role]': '"img"',
    '[attr.aria-label]': 'ariaLabel || "Chart"',
    '[attr.tabindex]': '0',
    '[style.height]': 'heightStyle',
  },
  template: `<div #chartEl class="size-full"></div>`,
})
export class UiRouteFlowMapComponent implements AfterViewInit, OnChanges, OnDestroy {
  /** Telemetry hubs keyed by `id`. */
  @Input() hubs: RouteHub[] = []
  /** Hub-id pairs with per-route telemetry. */
  @Input() routes: FlightRoute[] = []
  /** Controlled selected route id (uncontrolled internal state when unset). */
  @Input() selectedRoute?: string
  @Output() selectedRouteChange = new EventEmitter<string>()
  @Output() routeSelect = new EventEmitter<FlightRoute>()
  @Output() hubClick = new EventEmitter<RouteHub>()
  @Input() height: number | string = 480
  @Input() option?: Record<string, unknown>
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  @Input() ariaLabel?: string
  @Input('class') className?: string

  private internalRoute = ''

  @ViewChild('chartEl', { static: false }) chartEl?: ElementRef<HTMLDivElement>

  private chart: echarts.ECharts | null = null
  private unsubscribeTheme: (() => void) | null = null

  get hostClass(): string {
    return cn('block focus-visible:ring-ring w-full focus-visible:ring-2 focus-visible:outline-none', this.className)
  }

  get heightStyle(): string {
    return /^\d+$/.test(String(this.height)) ? `${this.height}px` : String(this.height)
  }
  hubById(): Map<string, RouteHub> {
    return new Map(this.hubs.map((h) => [h.id, h]))
  }

  get activeRouteId(): string {
    return this.selectedRoute !== undefined ? this.selectedRoute : this.internalRoute
  }

  /** Select a route (arc click): mirrors React's handleSelectRoute. */
  selectRoute(id: string): void {
    this.internalRoute = id
    this.selectedRouteChange.emit(id)
    const route = this.routes.find((r) => r.id === id)
    if (route) this.routeSelect.emit(route)
    this.chart?.setOption(this.getOption())
  }

  /** Build the merged ECharts option (pure — no DOM needed, unit-testable). */
  getOption(): Record<string, unknown> {
    const colors = getChartColors()
    const hubs = this.hubById()
    const activeId = this.activeRouteId
    const arcs: { route: FlightRoute; a: RouteHub; b: RouteHub }[] = []
    for (const r of this.routes) {
      const a = hubs.get(r.from)
      const b = hubs.get(r.to)
      if (a && b) arcs.push({ route: r, a, b })
    }
    const series = [
      {
        type: 'lines',
        coordinateSystem: 'cartesian2d' as const,
        effect: { show: true, period: 4, symbolSize: 5, color: colors[1] },
        lineStyle: { color: colors[0], width: 1.4, curveness: 0.25, opacity: 0.8 },
        data: arcs.map((x) => ({
          name: x.route.id,
          coords: [
            [x.a.lng, x.a.lat],
            [x.b.lng, x.b.lat],
          ],
          lineStyle:
            x.route.id === activeId
              ? { color: colors[1], width: 3, opacity: 1 }
              : x.route.color
                ? { color: x.route.color }
                : undefined,
        })),
      },
      {
        type: 'scatter',
        symbolSize: 10,
        itemStyle: { color: colors[1], borderWidth: 2 },
        data: this.hubs.map((h) => ({
          name: h.name,
          value: [h.lng, h.lat, 1],
          itemStyle: h.color ? { color: h.color, borderWidth: 2 } : undefined,
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
    const [{ use }, { CanvasRenderer }, { ScatterChart: EChartsScatterChart, LinesChart: EChartsLinesChart }, comps] =
      await Promise.all([
        import('echarts/core'),
        import('echarts/renderers'),
        import('echarts/charts'),
        import('echarts/components'),
      ])
    use([CanvasRenderer, EChartsScatterChart, EChartsLinesChart, comps.GridComponent, comps.TooltipComponent])
    const { init } = await import('echarts/core')
    this.chart = init(this.chartEl.nativeElement)
    this.chart.setOption(this.getOption())
    this.chart.on('click', (params: { seriesType?: string; dataIndex?: number; name?: string }) => {
      if (params.seriesType === 'lines' && params.name) this.selectRoute(params.name)
      else if (params.seriesType === 'scatter' && params.dataIndex !== undefined) {
        const hub = this.hubs[params.dataIndex]
        if (hub) this.hubClick.emit(hub)
      }
    })
    const { onChartThemeChange } = await import('../use-chart-theme')
    this.unsubscribeTheme = onChartThemeChange(() => this.chart?.setOption(this.getOption()))
    if (typeof ResizeObserver !== 'undefined') {
      new ResizeObserver(() => this.chart?.resize()).observe(this.chartEl.nativeElement)
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      this.chart &&
      (changes['hubs'] || changes['routes'] || changes['selectedRoute'] || changes['option'])
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
