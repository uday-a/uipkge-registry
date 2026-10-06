import { LitElement, css, html } from 'lit'
import { styleMap } from 'lit/directives/style-map.js'
import { Globe } from 'lucide'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import { icon } from '../../lib/icon'
import { cn } from '../../lib/utils'
import { heightToStyle } from './lib/chart-theme'
import { defaultTrue } from './lib/chart-element'
import '../map/map'

export interface MapRegion {
  id: string
  name: string
  path?: string
}

export interface VectorMapPin {
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

export function projectPoint(pt: { lat?: number; lng?: number; x?: number; y?: number }) {
  if (pt.x !== undefined && pt.y !== undefined) return { x: pt.x, y: pt.y }
  const lng = pt.lng ?? 0
  const lat = pt.lat ?? 0
  const x = ((lng + 180) / 360) * 1000
  const y = ((90 - lat) / 180) * 500
  return { x, y }
}

/**
 * <uip-vector-map> — the registry VectorMap (React `VectorMap`) as a web
 * component. Same region chips, pins, routes, record/hover cards and
 * projection toggle as React, rendered on the shipped <uip-map>
 * (declarative sources, layers and markers as its light-DOM children — the
 * web-component stand-in for React's JSX children).
 *
 * Properties (React props): `mode` ('countries' | 'continents'; default
 * 'continents'), `regions` (default WORLD_REGIONS), `region-data` (Record<id,
 * RegionDataRecord>), `selected-region`, `pins`, `routes`, `height` (default
 * 460), `interactive` (default true), `show-graticule` (accepted like React,
 * unused), `show-region-labels` (accepted like React, unused), `fill-color` /
 * `hover-color` / `stroke-color` (accepted like React, unused), `projection`
 * (initial 'globe' | 'mercator'), `aria-label` (React `ariaLabel`).
 * `access-token` forwards a Mapbox token to the inner map (elements never
 * read the environment). React's `className` → host classes.
 *
 * Events: `selected-region-change` (detail: id — React's
 * `onSelectedRegionChange`).
 */
export class UipVectorMap extends LitElement {
  // :host display can't be a utility class (the host has no template of its own).
  static styles = [tailwind, css`:host { display: block; }`]

  static properties = {
    mode: {},
    regions: { type: Array },
    regionData: { attribute: 'region-data', type: Object },
    selectedRegion: { attribute: 'selected-region' },
    pins: { type: Array },
    routes: { type: Array },
    height: {},
    interactive: { converter: defaultTrue },
    showGraticule: { attribute: 'show-graticule', converter: defaultTrue },
    showRegionLabels: { attribute: 'show-region-labels', converter: defaultTrue },
    fillColor: { attribute: 'fill-color' },
    hoverColor: { attribute: 'hover-color' },
    strokeColor: { attribute: 'stroke-color' },
    projection: {},
    accessToken: { attribute: 'access-token' },
    accessibleLabel: { attribute: 'aria-label' },
    internalRegion: { state: true },
    hoveredPin: { state: true },
  }

  mode: 'countries' | 'continents' = 'continents'
  regions: MapRegion[] = WORLD_REGIONS
  regionData: Record<string, RegionDataRecord> = {}
  selectedRegion?: string
  pins: VectorMapPin[] = []
  routes: FlowRoute[] = []
  height: number | string = 460
  interactive = true
  showGraticule = true
  showRegionLabels = true
  fillColor?: string
  hoverColor?: string
  strokeColor?: string
  projection: 'globe' | 'mercator' = 'globe'
  accessToken?: string
  accessibleLabel?: string
  private internalRegion = 'northAmerica'
  private hoveredPin: VectorMapPin | null = null

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'vector-map')
  }

  private get activeRegion() {
    return this.selectedRegion !== undefined ? this.selectedRegion : this.internalRegion
  }

  private handleSelectRegion(id: string) {
    if (!this.interactive) return
    this.internalRegion = id
    this.dispatchEvent(new CustomEvent('selected-region-change', { detail: id, bubbles: true, composed: true }))
  }

  private toggleProjection() {
    this.projection = this.projection === 'globe' ? 'mercator' : 'globe'
  }

  private get routesGeoJson() {
    const routes = this.routes ?? []
    if (!routes.length) return null
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
          properties: {
            color: r.color || 'rgba(56, 189, 248, 0.75)',
          },
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

  render() {
    const regions = this.regions ?? WORLD_REGIONS
    const activeRegion = this.activeRegion
    const activeRecord = (this.regionData ?? {})[activeRegion] || null
    const routesGeoJson = this.routesGeoJson
    const hoveredPin = this.hoveredPin
    return html`<div
      part="base"
      aria-label=${this.accessibleLabel ?? 'Vector map'}
      style=${styleMap({ height: heightToStyle(this.height) })}
      class="border-border bg-card group relative w-full overflow-hidden rounded-xl border shadow-xs"
    >
      <uip-map
        .accessToken=${this.accessToken}
        variant="dark"
        .projection=${this.projection}
        .center=${[10, 25]}
        .zoom=${1.6}
        class="size-full"
      >
        ${routesGeoJson
          ? html`<uip-map-source id="vector-routes-source" type="geojson" .data=${routesGeoJson}>
              <uip-map-layer
                id="vector-routes-layer"
                type="line"
                .paint=${{ 'line-color': ['get', 'color'] as any, 'line-width': 1.5, 'line-dasharray': [2, 2] }}
              ></uip-map-layer>
            </uip-map-source>`
          : null}
        ${(this.pins ?? []).map(
          (pin) => html`<uip-map-marker longitude=${pin.lng ?? 0} latitude=${pin.lat ?? 0} anchor="center" class="cursor-pointer select-none">
            <div
              class="relative flex size-6 items-center justify-center"
              @mouseenter=${() => (this.hoveredPin = pin)}
              @mouseleave=${() => (this.hoveredPin = null)}
            >
              <span
                class="absolute inline-flex size-full animate-ping rounded-full opacity-60"
                style=${styleMap({ backgroundColor: pin.color || 'oklch(0.65 0.20 145)' })}
              ></span>
              <span
                class="ring-background relative inline-flex size-2.5 rounded-full shadow-xs ring-2"
                style=${styleMap({
                  backgroundColor: pin.color || 'oklch(0.65 0.20 145)',
                  boxShadow: `0 0 10px ${pin.color || 'oklch(0.65 0.20 145)'}`,
                })}
              ></span>
            </div>
          </uip-map-marker>`,
        )}
      </uip-map>

      <div
        class="border-border/70 bg-card/85 absolute top-3 left-3 z-10 hidden max-w-md flex-wrap gap-1 rounded-lg border p-1.5 shadow-xs backdrop-blur-md md:flex"
      >
        ${regions.map(
          (r) => html`<button
            type="button"
            class=${cn(
              'rounded-md px-2 py-0.5 text-xs font-medium transition',
              activeRegion === r.id
                ? 'bg-primary text-primary-foreground font-semibold'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
            @click=${() => this.handleSelectRegion(r.id)}
          >
            ${r.name}
          </button>`,
        )}
      </div>

      <div
        class="border-border/70 bg-card/85 absolute top-3 right-3 z-10 flex items-center gap-1 rounded-lg border p-1 shadow-xs backdrop-blur-md"
      >
        <button
          type="button"
          class="text-muted-foreground hover:bg-muted hover:text-foreground flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition"
          @click=${this.toggleProjection}
        >
          ${icon(Globe, 'globe', 'size-3.5')}
          <span class="capitalize">${this.projection}</span>
        </button>
      </div>

      ${activeRecord
        ? html`<div
            class="border-border/80 bg-card/95 animate-in fade-in slide-in-from-bottom-2 absolute bottom-3 left-3 z-10 max-w-sm rounded-xl border p-3.5 shadow-lg backdrop-blur-md duration-150"
          >
            <div class="flex items-center gap-2">
              <span
                class="size-2 rounded-full"
                style=${styleMap({ backgroundColor: activeRecord.color || 'oklch(0.65 0.20 145)' })}
              ></span>
              <h4 class="text-foreground text-sm font-semibold capitalize">${activeRegion.replace(/([A-Z])/g, ' $1')}</h4>
              <span class="text-muted-foreground ml-auto font-mono text-xs uppercase">${activeRecord.status || 'Optimal'}</span>
            </div>

            ${activeRecord.value !== undefined
              ? html`<div class="border-border/60 mt-2.5 flex items-baseline justify-between border-t pt-2 font-mono text-xs">
                  <span class="text-muted-foreground">Active Nodes</span>
                  <span class="text-foreground font-semibold">${activeRecord.value.toLocaleString()}</span>
                </div>`
              : null}
            ${activeRecord.description
              ? html`<p class="text-muted-foreground mt-1.5 text-xs leading-relaxed">${activeRecord.description}</p>`
              : null}
          </div>`
        : null}
      ${hoveredPin
        ? html`<div
            class="border-border/80 bg-card/95 animate-in fade-in slide-in-from-bottom-2 absolute right-3 bottom-3 z-10 max-w-xs rounded-xl border p-3 shadow-lg backdrop-blur-md duration-150"
          >
            <div class="flex items-center gap-2">
              <span
                class="size-2 rounded-full"
                style=${styleMap({ backgroundColor: hoveredPin.color || 'oklch(0.65 0.20 145)' })}
              ></span>
              <h5 class="text-foreground text-xs font-semibold">${hoveredPin.label || 'Hub'}</h5>
            </div>
            ${hoveredPin.description ? html`<p class="text-muted-foreground mt-1 text-xs">${hoveredPin.description}</p>` : null}
            ${hoveredPin.value !== undefined
              ? html`<div class="border-border/60 mt-2 flex items-baseline justify-between border-t pt-1.5 font-mono text-xs">
                  <span class="text-muted-foreground">Throughput</span>
                  <span class="text-foreground font-semibold">${hoveredPin.value}</span>
                </div>`
              : null}
          </div>`
        : null}
    </div>`
  }
}

customElements.get('uip-vector-map') || customElements.define('uip-vector-map', UipVectorMap)

declare global {
  interface HTMLElementTagNameMap {
    'uip-vector-map': UipVectorMap
  }
}
