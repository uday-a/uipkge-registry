import { Component, Input, OnInit, signal, ChangeDetectionStrategy } from '@angular/core'
import { cn } from '@/lib/utils'
import {
  UiMapComponent,
  UiMapSourceComponent,
  UiMapLayerComponent,
  UiMapMarkerComponent,
  type MapVariant,
} from '@/ui/map/map.component'

export interface ChoroplethDatum {
  id: string
  value: number
  name?: string
}

export interface ChoroplethPin {
  name: string
  coord: [number, number]
  color?: string
}

export interface ChoroplethLink {
  from: [number, number]
  to: [number, number]
  label?: string
}

/**
 * Angular port of the UIPKGE ChoroplethMapChart (React/Vue). A Mapbox globe/mercator map
 * with a value-shaded GeoJSON fill layer, dashed corridor links, pin markers, a projection
 * switcher, and a continuous value-scale legend. `accessToken` is passed through to the
 * inner map (React/Vue read it from env; Angular needs it as an input).
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-choropleth-map-chart, [ui-choropleth-map-chart]',
  standalone: true,
  imports: [UiMapComponent, UiMapSourceComponent, UiMapLayerComponent, UiMapMarkerComponent],
  host: {
    '[attr.data-slot]': '"choropleth-map-chart"',
    '[attr.data-uipkge]': '""',
    '[attr.aria-label]': 'ariaLabel || null',
    '[class]': 'hostClass',
    '[style.height]': 'heightStyle',
  },
  template: `
    <ui-map
      [accessToken]="accessToken"
      [variant]="variant"
      [projection]="currentProjection()"
      [center]="center"
      [zoom]="zoom"
      class="size-full"
    >
      <ui-map-source id="choropleth-source" type="geojson" [data]="enrichedGeoJson">
        <ui-map-layer id="choropleth-fill" type="fill" [paint]="fillPaint" />
        <ui-map-layer id="choropleth-stroke" type="line" [paint]="strokePaint" />
      </ui-map-source>

      @if (linksGeoJson) {
        <ui-map-source id="choropleth-links-source" type="geojson" [data]="linksGeoJson">
          <ui-map-layer id="choropleth-links" type="line" [paint]="linkLinePaint" />
        </ui-map-source>
      }

      @for (pin of pins; track $index) {
        <ui-map-marker [lngLat]="pin.coord" anchor="bottom">
          <div class="flex flex-col items-center">
            <span
              class="size-3 rounded-full shadow-md ring-4"
              [style.backgroundColor]="pin.color || 'oklch(0.65 0.20 145)'"
              [style.boxShadow]="'0 0 10px ' + (pin.color || 'oklch(0.65 0.20 145)')"
            ></span>
            <span
              class="border-border/80 bg-background/90 mt-1 rounded border px-1.5 py-0.5 font-mono text-[10px] font-semibold shadow-xs backdrop-blur-xs"
            >
              {{ pin.name }}
            </span>
          </div>
        </ui-map-marker>
      }
    </ui-map>

    <div
      class="border-border/70 bg-card/85 absolute top-3 right-3 z-10 flex items-center gap-1 rounded-lg border p-1 shadow-xs backdrop-blur-md"
    >
      <button
        type="button"
        class="text-muted-foreground hover:bg-muted hover:text-foreground flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition"
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
          class="lucide lucide-globe size-3.5"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
          <path d="M2 12h20" />
        </svg>
        <span class="capitalize">{{ currentProjection() }}</span>
      </button>
    </div>

    @if (showScale && values.length > 0) {
      <div
        class="border-border/70 bg-card/85 absolute right-3 bottom-3 z-10 hidden items-center gap-2.5 rounded-lg border px-3 py-2 text-xs shadow-xs backdrop-blur-md sm:flex"
      >
        <span class="text-muted-foreground font-mono text-[11px]">Range</span>
        <span class="text-muted-foreground font-mono text-[10px]">{{ minValue }}</span>
        <div class="h-2 w-24 rounded-full bg-gradient-to-r from-sky-400/30 to-sky-400"></div>
        <span class="text-foreground font-mono text-[10px] font-semibold">{{ maxValue }}</span>
      </div>
    }
  `,
})
export class UiChoroplethMapChartComponent implements OnInit {
  @Input() geoJson: any
  @Input() mapName = 'uipkge-map'
  @Input() data: ChoroplethDatum[] = []
  @Input() idField: 'id' | 'name' = 'id'
  @Input() pins: ChoroplethPin[] = []
  @Input() links: ChoroplethLink[] = []
  @Input() showScale = true
  @Input() height: number | string = 420
  @Input() center: [number, number] = [0, 20]
  @Input() zoom = 1.5
  @Input() variant: MapVariant = 'dark'
  @Input() projection: 'globe' | 'mercator' = 'globe'
  /** Mapbox token, passed through to the inner map. */
  @Input() accessToken = ''
  /** Accessible name for the map region. */
  @Input() ariaLabel?: string
  @Input('class') className?: string

  readonly currentProjection = signal<'globe' | 'mercator'>('globe')

  /** React reads the initial projection once (useState); later input changes are ignored too. */
  ngOnInit(): void {
    this.currentProjection.set(this.projection)
  }

  toggleProjection(): void {
    this.currentProjection.set(this.currentProjection() === 'globe' ? 'mercator' : 'globe')
  }

  get hostClass(): string {
    return cn('block border-border bg-card group relative w-full overflow-hidden rounded-xl border shadow-xs', this.className)
  }

  get heightStyle(): string {
    if (typeof this.height === 'number') return `${this.height}px`
    return /^\d+$/.test(String(this.height)) ? `${this.height}px` : String(this.height)
  }

  get dataMap(): Map<string, number> {
    const map = new globalThis.Map<string, number>()
    if (!this.data) return map
    for (const d of this.data) {
      map.set(String(d.id).toLowerCase(), d.value)
      if (d.name) map.set(String(d.name).toLowerCase(), d.value)
    }
    return map
  }

  get values(): number[] {
    return this.data ? this.data.map((d) => d.value) : []
  }

  get minValue(): number {
    return this.values.length ? Math.min(...this.values) : 0
  }

  get maxValue(): number {
    return this.values.length ? Math.max(...this.values) : 100
  }

  get enrichedGeoJson(): any {
    if (!this.geoJson || !this.geoJson.features) return this.geoJson
    const map = this.dataMap
    const features = this.geoJson.features.map((f: any) => {
      const idVal = f.id !== undefined ? String(f.id).toLowerCase() : ''
      const nameVal = f.properties?.name ? String(f.properties.name).toLowerCase() : ''
      const matchedVal = map.get(idVal) ?? map.get(nameVal) ?? null
      return {
        ...f,
        properties: { ...f.properties, value: matchedVal, title: f.properties?.name || f.id || 'Region' },
      }
    })
    return { ...this.geoJson, features }
  }

  get fillPaint(): Record<string, unknown> {
    return {
      'fill-color': [
        'case',
        ['!=', ['get', 'value'], null],
        [
          'interpolate',
          ['linear'],
          ['get', 'value'],
          this.minValue,
          'rgba(56, 189, 248, 0.25)',
          this.maxValue,
          'rgba(56, 189, 248, 0.9)',
        ],
        'rgba(255, 255, 255, 0.04)',
      ],
      'fill-opacity': 0.85,
    }
  }

  get strokePaint(): Record<string, unknown> {
    return { 'line-color': 'rgba(255, 255, 255, 0.25)', 'line-width': 1 }
  }

  get linksGeoJson(): Record<string, unknown> | null {
    if (!this.links || !this.links.length) return null
    return {
      type: 'FeatureCollection',
      features: this.links.map((link) => ({
        type: 'Feature',
        properties: { label: link.label },
        geometry: { type: 'LineString', coordinates: [link.from, link.to] },
      })),
    }
  }

  get linkLinePaint(): Record<string, unknown> {
    return { 'line-color': 'rgba(245, 158, 11, 0.75)', 'line-width': 2, 'line-dasharray': [2, 2] }
  }
}
