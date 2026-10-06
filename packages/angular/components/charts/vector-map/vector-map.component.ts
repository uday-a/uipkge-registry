import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ChangeDetectionStrategy,
} from '@angular/core'
import { cn } from '@/lib/utils'
import {
  UiMapComponent,
  UiMapSourceComponent,
  UiMapLayerComponent,
  UiMapMarkerComponent,
} from '@/ui/map/map.component'

export interface MapRegion {
  id: string
  name: string
  path?: string
}

export interface MapPin {
  id?: string
  lat?: number
  lng?: number
  x?: number
  y?: number
  label?: string
  value?: string | number
  color?: string
  status?: string
  description?: string
}

export interface FlowRoute {
  id?: string
  from: { lat?: number; lng?: number; x?: number; y?: number }
  to: { lat?: number; lng?: number; x?: number; y?: number }
  color?: string
  width?: number
  curvature?: number
  animated?: boolean
  dashed?: boolean
  duration?: number
  label?: string
}

export interface RegionDataRecord {
  value?: number
  label?: string
  status?: string
  color?: string
  description?: string
}

export const WORLD_REGIONS: MapRegion[] = [
  { id: 'northAmerica', name: 'North America' },
  { id: 'southAmerica', name: 'South America' },
  { id: 'europe', name: 'Europe' },
  { id: 'asia', name: 'Asia' },
  { id: 'africa', name: 'Africa' },
  { id: 'australiaOceania', name: 'Oceania' },
  { id: 'unitedKingdom', name: 'United Kingdom' },
  { id: 'japan', name: 'Japan' },
]

export const WORLD_COUNTRIES: MapRegion[] = [
  { id: 'US', name: 'United States' },
  { id: 'CA', name: 'Canada' },
  { id: 'GB', name: 'United Kingdom' },
  { id: 'DE', name: 'Germany' },
  { id: 'FR', name: 'France' },
  { id: 'JP', name: 'Japan' },
  { id: 'CN', name: 'China' },
  { id: 'IN', name: 'India' },
  { id: 'BR', name: 'Brazil' },
  { id: 'AU', name: 'Australia' },
]

export function projectPoint(pt: { lat?: number; lng?: number; x?: number; y?: number }): { x: number; y: number } {
  if (pt.x !== undefined && pt.y !== undefined) return { x: pt.x, y: pt.y }
  const lng = pt.lng ?? 0
  const lat = pt.lat ?? 0
  const x = ((lng + 180) / 360) * 1000
  const y = ((90 - lat) / 180) * 500
  return { x, y }
}

const PIN_FALLBACK = 'oklch(0.65 0.20 145)'
const ROUTE_FALLBACK = 'rgba(56, 189, 248, 0.75)'

export function buildRoutesGeoJson(routes: FlowRoute[]): unknown | null {
  if (!routes || !routes.length) return null
  return {
    type: 'FeatureCollection',
    features: routes.map((r, i) => {
      const fromLng = r.from.lng ?? -74
      const fromLat = r.from.lat ?? 40
      const toLng = r.to.lng ?? 8
      const toLat = r.to.lat ?? 50
      return {
        type: 'Feature',
        id: i,
        properties: { color: r.color || ROUTE_FALLBACK },
        geometry: {
          type: 'LineString',
          coordinates: [
            [fromLng, fromLat],
            [(fromLng + toLng) / 2, (fromLat + toLat) / 2 + 5],
            [toLng, toLat],
          ],
        },
      }
    }),
  }
}

/**
 * Angular port of the UIPKGE VectorMap (React/Vue parity): a dark Mapbox globe
 * with pulsing pins, dashed flow routes, region selector chips, a globe/mercator
 * toggle, and telemetry cards for the active region and hovered pin.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-vector-map, [ui-vector-map]',
  standalone: true,
  imports: [UiMapComponent, UiMapSourceComponent, UiMapLayerComponent, UiMapMarkerComponent],
  host: {
    '[attr.data-slot]': '"vector-map"',
    '[attr.data-uipkge]': '""',
    '[attr.aria-label]': 'ariaLabel || null',
    '[class]': 'hostClass',
    '[style.height]': 'heightStyle',
  },
  template: `
    <ui-map
      variant="dark"
      [projection]="currentProjection"
      [center]="mapCenter"
      [zoom]="1.6"
      [accessToken]="accessToken"
      class="size-full"
    >
      @if (routesGeoJson) {
        <ui-map-source id="vector-routes-source" type="geojson" [data]="routesGeoJson">
          <ui-map-layer id="vector-routes-layer" type="line" [paint]="routeLinePaint" />
        </ui-map-source>
      }
      @for (pin of pins; track $index) {
        <ui-map-marker [lngLat]="[pin.lng ?? 0, pin.lat ?? 0]" anchor="center">
          <div
            class="relative flex size-6 cursor-pointer items-center justify-center select-none"
            (mouseenter)="hoveredPin = pin"
            (mouseleave)="hoveredPin = null"
            (click)="selectPin.emit(pin)"
          >
            <span
              class="absolute inline-flex size-full animate-ping rounded-full opacity-60"
              [style.background-color]="pin.color || pinFallback"
            ></span>
            <span
              class="ring-background relative inline-flex size-2.5 rounded-full shadow-xs ring-2"
              [style.background-color]="pin.color || pinFallback"
              [style.box-shadow]="'0 0 10px ' + (pin.color || pinFallback)"
            ></span>
          </div>
        </ui-map-marker>
      }
    </ui-map>

    <div
      class="border-border/70 bg-card/85 absolute top-3 left-3 z-10 hidden max-w-md flex-wrap gap-1 rounded-lg border p-1.5 shadow-xs backdrop-blur-md md:flex"
    >
      @for (r of regions; track r.id) {
        <button type="button" [class]="chipClass(r.id)" (click)="handleSelectRegion(r.id)">
          {{ r.name }}
        </button>
      }
    </div>

    <div
      class="border-border/70 bg-card/85 absolute top-3 right-3 z-10 flex items-center gap-1 rounded-lg border p-1 shadow-xs backdrop-blur-md"
    >
      <button
        type="button"
        class="text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-ring flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition focus-visible:ring-2 focus-visible:outline-none"
        (click)="toggleProjection()"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="size-3.5"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
          <path d="M2 12h20" />
        </svg>
        <span class="capitalize">{{ currentProjection }}</span>
      </button>
    </div>

    @if (activeRecord; as record) {
      <div
        class="border-border/80 bg-card/95 animate-in fade-in slide-in-from-bottom-2 absolute bottom-3 left-3 z-10 max-w-sm rounded-xl border p-3.5 shadow-lg backdrop-blur-md duration-150"
      >
        <div class="flex items-center gap-2">
          <span class="size-2 rounded-full" [style.background-color]="record.color || pinFallback"></span>
          <h4 class="text-foreground text-sm font-semibold capitalize">{{ displayRegionName }}</h4>
          <span class="text-muted-foreground ml-auto font-mono text-xs uppercase">{{ record.status || 'Optimal' }}</span>
        </div>
        @if (record.value !== undefined) {
          <div class="border-border/60 mt-2.5 flex items-baseline justify-between border-t pt-2 font-mono text-xs">
            <span class="text-muted-foreground">Active Nodes</span>
            <span class="text-foreground font-semibold">{{ record.value.toLocaleString() }}</span>
          </div>
        }
        @if (record.description) {
          <p class="text-muted-foreground mt-1.5 text-xs leading-relaxed">{{ record.description }}</p>
        }
      </div>
    }

    @if (hoveredPin; as pin) {
      <div
        class="border-border/80 bg-card/95 animate-in fade-in slide-in-from-bottom-2 absolute right-3 bottom-3 z-10 max-w-xs rounded-xl border p-3 shadow-lg backdrop-blur-md duration-150"
      >
        <div class="flex items-center gap-2">
          <span class="size-2 rounded-full" [style.background-color]="pin.color || pinFallback"></span>
          <h5 class="text-foreground text-xs font-semibold">{{ pin.label || 'Hub' }}</h5>
        </div>
        @if (pin.description) {
          <p class="text-muted-foreground mt-1 text-xs">{{ pin.description }}</p>
        }
        @if (pin.value !== undefined) {
          <div class="border-border/60 mt-2 flex items-baseline justify-between border-t pt-1.5 font-mono text-xs">
            <span class="text-muted-foreground">Throughput</span>
            <span class="text-foreground font-semibold">{{ pin.value }}</span>
          </div>
        }
      </div>
    }
  `,
})
export class UiVectorMapComponent implements OnChanges {
  @Input() mode: 'countries' | 'continents' = 'continents'
  @Input() regions: MapRegion[] = WORLD_REGIONS
  @Input() regionData: Record<string, RegionDataRecord> = {}
  /** Controlled active region id (pair with `selectedRegionChange`). */
  @Input() selectedRegion?: string
  @Input() pins: MapPin[] = []
  @Input() routes: FlowRoute[] = []
  @Input() height: number | string = 460
  @Input() interactive = true
  /** Reserved for React/Vue API parity (unused there too). */
  @Input() showGraticule?: boolean
  /** Reserved for React/Vue API parity (unused there too). */
  @Input() showRegionLabels?: boolean
  /** Reserved for React/Vue API parity (unused there too). */
  @Input() fillColor?: string
  /** Reserved for React/Vue API parity (unused there too). */
  @Input() hoverColor?: string
  /** Reserved for React/Vue API parity (unused there too). */
  @Input() strokeColor?: string
  @Input() projection: 'globe' | 'mercator' = 'globe'
  /** Mapbox access token, passed through to the map (Angular-only: React/Vue read env). */
  @Input() accessToken = ''
  @Input() ariaLabel?: string
  @Input('class') className?: string

  /** React `onSelectedRegionChange`. */
  @Output() selectedRegionChange = new EventEmitter<string>()
  /** Vue `selectRegion`. */
  @Output() selectRegion = new EventEmitter<string>()
  /** Vue `selectPin`. */
  @Output() selectPin = new EventEmitter<MapPin>()

  currentProjection: 'globe' | 'mercator' = 'globe'
  hoveredPin: MapPin | null = null
  routesGeoJson: unknown | null = null
  private internalRegion = 'northAmerica'

  readonly mapCenter: [number, number] = [10, 25]
  readonly pinFallback = PIN_FALLBACK
  readonly routeLinePaint: Record<string, unknown> = {
    'line-color': ['get', 'color'],
    'line-width': 1.5,
    'line-dasharray': [2, 2],
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['projection']) this.currentProjection = this.projection
    if (changes['routes']) this.routesGeoJson = buildRoutesGeoJson(this.routes)
  }

  get hostClass(): string {
    return cn(
      'block border-border bg-card group relative w-full overflow-hidden rounded-xl border shadow-xs',
      this.className,
    )
  }

  get heightStyle(): string {
    if (typeof this.height === 'number') return `${this.height}px`
    return /^\d+$/.test(String(this.height)) ? `${this.height}px` : String(this.height)
  }

  get activeRegion(): string {
    return this.selectedRegion ?? this.internalRegion
  }

  get activeRecord(): RegionDataRecord | null {
    return this.regionData[this.activeRegion] || null
  }

  get displayRegionName(): string {
    return this.activeRegion.replace(/([A-Z])/g, ' $1')
  }

  chipClass(id: string): string {
    return cn(
      'rounded-md px-2 py-0.5 text-xs font-medium transition focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none',
      this.activeRegion === id
        ? 'bg-primary text-primary-foreground font-semibold'
        : 'text-muted-foreground hover:bg-muted hover:text-foreground',
    )
  }

  handleSelectRegion(id: string): void {
    if (!this.interactive) return
    this.internalRegion = id
    this.selectedRegionChange.emit(id)
    this.selectRegion.emit(id)
  }

  toggleProjection(): void {
    this.currentProjection = this.currentProjection === 'globe' ? 'mercator' : 'globe'
  }
}
