import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  ViewChildren,
  signal,
} from '@angular/core'
import type * as mapboxgl from 'mapbox-gl'
import { Globe, LucideAngularModule } from 'lucide-angular'
import { cn } from '@/lib/utils'
import { UiMapComponent, type MapLayerInput, type MapSourceInput, type MapVariant } from '@/ui/map/map.component'
import { onChartThemeChange, toCanvasColor } from '../use-chart-theme'

export interface MapPin {
  lat: number
  lng: number
  label?: string
  color?: string
  description?: string
  value?: string | number
  status?: string
}

export interface MapRoute {
  from: { lat: number; lng: number }
  to: { lat: number; lng: number }
  color?: string
  width?: number
  curvature?: number
  animated?: boolean
  dashed?: boolean
  duration?: number
  label?: string
}

const DEFAULT_PIN_COLOR = 'oklch(0.65 0.20 145)'
const DEFAULT_DOT_COLOR = 'rgba(255, 255, 255, 0.22)'
const DEFAULT_ROUTE_COLOR = 'rgba(56, 189, 248, 0.75)'

// Mapbox GL paint needs a concrete color — resolve `var(--token)` values
// (the natural way to pass theme colors) via getComputedStyle first.
export function resolvePaintColor(value: string): string {
  const match = value.trim().match(/^var\(\s*(--[\w-]+)\s*\)$/)
  const name = match?.[1]
  if (!name || typeof window === 'undefined') return value
  const resolved = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return resolved ? toCanvasColor(resolved) : value
}

/** React's three-point route arc: straight to a midpoint lifted 5° of latitude, then on to the end. */
export function routeCoordinates(r: MapRoute): [number, number][] {
  return [
    [r.from.lng, r.from.lat],
    [(r.from.lng + r.to.lng) / 2, (r.from.lat + r.to.lat) / 2 + 5],
    [r.to.lng, r.to.lat],
  ]
}

function envMapboxToken(): string | undefined {
  try {
    return ((import.meta as any).env?.PUBLIC_MAPBOX_TOKEN as string | undefined) || undefined
  } catch {
    return undefined
  }
}

/**
 * Angular port of the UIPKGE DottedMapChart: a Mapbox GL map (via `ui-map`)
 * with a dot-grid circle layer, route line layers and pulsing HTML pin
 * markers with a hover card. Without a Mapbox token `ui-map` renders its
 * "Mapbox token required" placeholder.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-dotted-map-chart, [ui-dotted-map-chart]',
  standalone: true,
  imports: [UiMapComponent, LucideAngularModule],
  host: {
    '[attr.data-slot]': '"dotted-map-chart"',
    '[attr.data-uipkge]': '""',
    '[class]': '"contents"',
  },
  template: `
    <div
      [class]="rootClass"
      [style.height]="heightStyle"
      [attr.role]="ariaLabel ? 'region' : null"
      [attr.aria-label]="ariaLabel || null"
    >
      <ui-map
        [variant]="variant"
        [projection]="currentProjection()"
        [center]="mapCenter"
        [zoom]="mapZoom"
        [accessToken]="resolvedToken"
        [sources]="mapSources"
        [layers]="mapLayers"
        class="size-full"
        (created)="onMapCreated($event)"
      />

      <div class="hidden">
        @for (pin of pins; track $index) {
          <div #pinMarker class="cursor-pointer select-none">
            <div
              data-slot="dotted-map-pin"
              class="relative flex size-6 items-center justify-center"
              (mouseenter)="onPinEnter(pin)"
              (mouseleave)="onPinLeave()"
              (click)="pinClick.emit(pin)"
            >
              @if (pulse) {
                <span
                  class="absolute inline-flex size-full animate-ping rounded-full opacity-60"
                  [style.background-color]="pin.color || defaultPinColor"
                ></span>
              }
              <span
                class="ring-background relative inline-flex size-2.5 rounded-full shadow-xs ring-2"
                [style.background-color]="pin.color || defaultPinColor"
                [style.box-shadow]="'0 0 10px ' + (pin.color || defaultPinColor)"
              ></span>
            </div>
          </div>
        }
      </div>

      <div
        class="border-border/70 bg-card/85 absolute top-3 right-3 z-10 flex items-center gap-1 rounded-lg border p-1 shadow-xs backdrop-blur-md"
      >
        <button
          type="button"
          class="text-muted-foreground hover:bg-muted hover:text-foreground flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition"
          (click)="toggleProjection()"
        >
          <lucide-icon [img]="Globe" class="size-3.5" />
          <span class="capitalize">{{ currentProjection() }}</span>
        </button>
      </div>

      @if (hoveredPin(); as hp) {
        @if (interactive) {
          <div
            data-slot="dotted-map-hover-card"
            class="border-border/80 bg-card/95 animate-in fade-in slide-in-from-bottom-2 absolute bottom-3 left-3 z-10 max-w-xs rounded-xl border p-3 shadow-lg backdrop-blur-md duration-150"
          >
            <div class="flex items-center gap-2">
              <span class="size-2 rounded-full" [style.background-color]="hp.color || defaultPinColor"></span>
              <h5 class="text-foreground text-xs font-semibold">{{ hp.label || 'Telemetry Node' }}</h5>
            </div>
            @if (hp.description) {
              <p class="text-muted-foreground mt-1 text-xs">{{ hp.description }}</p>
            }
            @if (hp.value !== undefined) {
              <div class="border-border/60 mt-2 flex items-baseline justify-between border-t pt-1.5 font-mono text-xs">
                <span class="text-muted-foreground">Value</span>
                <span class="text-foreground font-semibold">{{ hp.value }}</span>
              </div>
            }
          </div>
        }
      }
    </div>
  `,
})
export class UiDottedMapChartComponent implements OnInit, OnChanges, AfterViewChecked, OnDestroy {
  @Input() pins: MapPin[] = []
  @Input() routes: MapRoute[] = []
  @Input() map: 'world' | 'usa' = 'world'
  /** Accepted for API parity with React; the dot grid is always a vertical lattice. */
  @Input() grid: 'vertical' | 'diagonal' = 'vertical'
  /** Accepted for API parity with React; dots always render as circles. */
  @Input() shape: 'circle' | 'hexagon' = 'circle'
  @Input() dotColor = DEFAULT_DOT_COLOR
  @Input() pulse = true
  @Input() height: number | string = 420
  @Input() ariaLabel?: string
  /** Show the hover card for the hovered pin. */
  @Input() interactive = true
  @Input() variant: MapVariant = 'dark'
  /** Initial projection; the corner toggle switches it afterwards. */
  @Input() projection: 'globe' | 'mercator' = 'globe'
  /** Mapbox token. Falls back to `PUBLIC_MAPBOX_TOKEN`; pass `''` to force the no-token placeholder. */
  @Input() accessToken?: string
  @Input('class') className?: string

  /** Fired when a pin is clicked. */
  @Output() pinClick = new EventEmitter<MapPin>()
  /** Fired with the hovered pin, or null when the pointer leaves it. */
  @Output() pinHover = new EventEmitter<MapPin | null>()

  @ViewChildren('pinMarker') pinMarkers?: QueryList<ElementRef<HTMLDivElement>>

  protected readonly Globe = Globe
  protected readonly defaultPinColor = DEFAULT_PIN_COLOR

  readonly currentProjection = signal<'globe' | 'mercator'>('globe')
  readonly hoveredPin = signal<MapPin | null>(null)

  mapSources: MapSourceInput[] = []
  mapLayers: MapLayerInput[] = []

  private mapInstance: mapboxgl.Map | null = null
  private Marker: typeof mapboxgl.Marker | null = null
  private markers: mapboxgl.Marker[] = []
  private markersDirty = false
  private unsubscribeTheme: (() => void) | null = null

  get rootClass(): string {
    return cn('border-border bg-card group relative w-full overflow-hidden rounded-xl border shadow-xs', this.className)
  }

  get heightStyle(): string {
    return /^\d+(\.\d+)?$/.test(String(this.height)) ? `${this.height}px` : String(this.height)
  }

  get mapCenter(): [number, number] {
    return this.map === 'usa' ? [-98, 39] : [0, 20]
  }

  get mapZoom(): number {
    return this.map === 'usa' ? 3.5 : 1.5
  }

  get resolvedToken(): string {
    return this.accessToken ?? envMapboxToken() ?? ''
  }

  /** Dot lattice over the world (6° step) or the contiguous USA (3° step). */
  buildDotGrid(): { type: 'FeatureCollection'; features: unknown[] } {
    const features: unknown[] = []
    const usa = this.map === 'usa'
    const step = usa ? 3 : 6
    const latMin = usa ? 25 : -55
    const latMax = usa ? 50 : 70
    const lngMin = usa ? -125 : -170
    const lngMax = usa ? -66 : 170
    for (let lat = latMin; lat <= latMax; lat += step) {
      for (let lng = lngMin; lng <= lngMax; lng += step) {
        features.push({ type: 'Feature', geometry: { type: 'Point', coordinates: [lng, lat] } })
      }
    }
    return { type: 'FeatureCollection', features }
  }

  /**
   * Route line features. Like React/Vue, only `color` is read (passed to Mapbox as given);
   * `width`, `dashed` and `curvature` are accepted but every route draws 1.5px, dashed, on the fixed arc.
   */
  buildRoutes(): { type: 'FeatureCollection'; features: unknown[] } {
    return {
      type: 'FeatureCollection',
      features: (this.routes ?? []).map((r, i) => ({
        type: 'Feature',
        id: i,
        properties: {
          color: r.color || DEFAULT_ROUTE_COLOR,
          dashed: r.dashed ?? true,
        },
        geometry: { type: 'LineString', coordinates: routeCoordinates(r) },
      })),
    }
  }

  buildDotPaint(): Record<string, unknown> {
    return {
      'circle-radius': 1.5,
      'circle-color': resolvePaintColor(this.dotColor || DEFAULT_DOT_COLOR),
      'circle-opacity': 0.4,
    }
  }

  ngOnInit(): void {
    this.currentProjection.set(this.projection)
    this.rebuildLayers()
    this.unsubscribeTheme = onChartThemeChange(() => this.refreshMapData())
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pins']) this.markersDirty = true
    if (!changes['routes'] && !changes['map'] && !changes['dotColor']) return
    this.refreshMapData()
  }

  ngAfterViewChecked(): void {
    if (this.markersDirty && this.mapInstance && this.Marker) this.syncMarkers()
  }

  ngOnDestroy(): void {
    this.unsubscribeTheme?.()
    this.unsubscribeTheme = null
    this.removeMarkers()
    this.mapInstance = null
  }

  async onMapCreated(map: mapboxgl.Map): Promise<void> {
    this.mapInstance = map
    const mod = await import('mapbox-gl')
    const mapbox = mod.default ?? mod
    this.Marker = mapbox.Marker as unknown as typeof mapboxgl.Marker
    this.syncMarkers()
  }

  onPinEnter(pin: MapPin): void {
    this.hoveredPin.set(pin)
    this.pinHover.emit(pin)
  }

  onPinLeave(): void {
    this.hoveredPin.set(null)
    this.pinHover.emit(null)
  }

  toggleProjection(): void {
    const next = this.currentProjection() === 'globe' ? 'mercator' : 'globe'
    this.currentProjection.set(next)
    try {
      ;(this.mapInstance as unknown as { setProjection?: (p: string) => void } | null)?.setProjection?.(next)
    } catch {
      /* older api */
    }
  }

  private rebuildLayers(): void {
    this.mapSources = [
      { id: 'dot-grid-source', type: 'geojson', data: this.buildDotGrid() },
      { id: 'routes-source', type: 'geojson', data: this.buildRoutes() },
    ]
    this.mapLayers = [
      { id: 'dot-grid-layer', type: 'circle', source: 'dot-grid-source', paint: this.buildDotPaint() },
      {
        id: 'routes-layer',
        type: 'line',
        source: 'routes-source',
        paint: { 'line-color': ['get', 'color'], 'line-width': 1.5, 'line-dasharray': [2, 2] },
      },
    ]
  }

  /** Rebuild source data + paint and push them onto a live map (sources exist once the style loaded). */
  private refreshMapData(): void {
    this.rebuildLayers()
    const map = this.mapInstance
    if (!map) return
    try {
      for (const s of this.mapSources) {
        ;(map.getSource(s.id) as { setData?: (d: unknown) => void } | undefined)?.setData?.(s.data)
      }
      if (map.getLayer('dot-grid-layer')) {
        map.setPaintProperty('dot-grid-layer', 'circle-color', this.buildDotPaint()['circle-color'] as string)
      }
    } catch {
      /* style reloading — ui-map re-adds sources from the inputs on style.load */
    }
  }

  private removeMarkers(): void {
    for (const m of this.markers) m.remove()
    this.markers = []
  }

  private syncMarkers(): void {
    this.markersDirty = false
    const map = this.mapInstance
    const Marker = this.Marker
    if (!map || !Marker) return
    this.removeMarkers()
    const els = this.pinMarkers?.toArray() ?? []
    els.forEach((ref, i) => {
      const pin = this.pins[i]
      if (!pin) return
      const marker = new Marker({ element: ref.nativeElement, anchor: 'center' })
        .setLngLat([pin.lng, pin.lat])
        .addTo(map)
      this.markers.push(marker)
    })
  }
}
