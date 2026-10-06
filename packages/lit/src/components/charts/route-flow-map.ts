import { LitElement, css, html } from 'lit'
import { styleMap } from 'lit/directives/style-map.js'
import { Globe, Plane } from 'lucide'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import { icon } from '../../lib/icon'
import { cn } from '../../lib/utils'
import { heightToStyle, resolveChartTheme, subscribeChartTheme } from './lib/chart-theme'
import { defaultTrue } from './lib/chart-element'
import '../map/map'

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
 * <uip-route-flow-map> — the registry RouteFlowMap (React `RouteFlowMap`) as
 * a web component. Same hubs, route arcs, vehicle pills, selection card and
 * projection toggle as React, rendered on the shipped <uip-map>
 * (declarative sources, layers and markers as its light-DOM children — the
 * web-component stand-in for React's JSX children).
 *
 * Properties (React props): `hubs`, `routes`, `selected-route`,
 * `show-hub-labels` (default true; `show-hub-labels="false"` hides them),
 * `show-graticule` (default true; accepted like React, unused), `height`
 * (default 480), `interactive` (default true), `projection` (initial 'globe'
 * | 'mercator'), `aria-label` (React `ariaLabel`). `access-token` forwards a
 * Mapbox token to the inner map (elements never read the environment).
 * React's `className` → host classes.
 *
 * Events: `selected-route-change` (detail: id — React's
 * `onSelectedRouteChange`), `route-select` (detail: the FlightRoute — React's
 * `onRouteSelect`), `hub-click` (detail: the RouteHub — React's `onHubClick`).
 */
export class UipRouteFlowMap extends LitElement {
  // :host display can't be a utility class (the host has no template of its own).
  static styles = [tailwind, css`:host { display: block; }`]

  static properties = {
    hubs: { type: Array },
    routes: { type: Array },
    selectedRoute: { attribute: 'selected-route' },
    showHubLabels: { attribute: 'show-hub-labels', converter: defaultTrue },
    showGraticule: { attribute: 'show-graticule', converter: defaultTrue },
    height: {},
    interactive: { converter: defaultTrue },
    projection: {},
    accessToken: { attribute: 'access-token' },
    accessibleLabel: { attribute: 'aria-label' },
    internalRoute: { state: true },
    hoveredHub: { state: true },
    accentColor: { state: true },
  }

  hubs: RouteHub[] = []
  routes: FlightRoute[] = []
  selectedRoute?: string
  showHubLabels = true
  showGraticule = true
  height: number | string = 480
  interactive = true
  projection: 'globe' | 'mercator' = 'globe'
  accessToken?: string
  accessibleLabel?: string
  private internalRoute = ''
  private hoveredHub: RouteHub | null = null
  private accentColor = resolveChartTheme().accentColor
  private unsubscribeTheme?: () => void

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'route-flow-map')
    this.accentColor = resolveChartTheme().accentColor
    this.unsubscribeTheme = subscribeChartTheme(() => {
      this.accentColor = resolveChartTheme().accentColor
    })
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.unsubscribeTheme?.()
  }

  private get activeRouteId() {
    return this.selectedRoute !== undefined ? this.selectedRoute : this.internalRoute
  }

  private get hubMap() {
    const map = new Map<string, RouteHub>()
    for (const h of this.hubs ?? []) map.set(h.id, h)
    return map
  }

  private get routesGeoJson() {
    const routes = this.routes ?? []
    if (!routes.length) return null
    const hubMap = this.hubMap
    const activeRouteId = this.activeRouteId
    return {
      type: 'FeatureCollection',
      features: routes
        .map((r) => {
          const fromHub = hubMap.get(r.from)
          const toHub = hubMap.get(r.to)
          if (!fromHub || !toHub) return null

          const midLng = (fromHub.lng + toHub.lng) / 2
          const midLat = (fromHub.lat + toHub.lat) / 2 + 10

          return {
            type: 'Feature',
            id: r.id,
            properties: {
              id: r.id,
              color: r.color || 'rgba(56, 189, 248, 0.8)',
              selected: activeRouteId === r.id,
            },
            geometry: {
              type: 'LineString',
              coordinates: [
                [fromHub.lng, fromHub.lat],
                [midLng, midLat],
                [toHub.lng, toHub.lat],
              ],
            },
          }
        })
        .filter(Boolean),
    }
  }

  private get routeLinePaint() {
    const activeRouteId = this.activeRouteId
    return {
      'line-color': ['case', ['==', ['get', 'id'], activeRouteId], this.accentColor, ['get', 'color']] as any,
      'line-width': ['case', ['==', ['get', 'id'], activeRouteId], 3, 1.5] as any,
      'line-dasharray': [2, 2],
    }
  }

  private handleSelectRoute(r: FlightRoute) {
    if (!this.interactive) return
    this.internalRoute = r.id
    this.dispatchEvent(new CustomEvent('selected-route-change', { detail: r.id, bubbles: true, composed: true }))
    this.dispatchEvent(new CustomEvent('route-select', { detail: r, bubbles: true, composed: true }))
  }

  private clearRoute() {
    this.internalRoute = ''
    this.dispatchEvent(new CustomEvent('selected-route-change', { detail: '', bubbles: true, composed: true }))
  }

  private getVehiclePosition(r: FlightRoute): [number, number] | null {
    const hubMap = this.hubMap
    const fromHub = hubMap.get(r.from)
    const toHub = hubMap.get(r.to)
    if (!fromHub || !toHub) return null
    const progress = (r.progress ?? 50) / 100
    const lng = fromHub.lng + (toHub.lng - fromHub.lng) * progress
    const lat = fromHub.lat + (toHub.lat - fromHub.lat) * progress + Math.sin(progress * Math.PI) * 10
    return [lng, lat]
  }

  private toggleProjection() {
    this.projection = this.projection === 'globe' ? 'mercator' : 'globe'
  }

  render() {
    const hubs = this.hubs ?? []
    const routes = this.routes ?? []
    const activeRouteId = this.activeRouteId
    const activeRoute = routes.find((r) => r.id === activeRouteId)
    const routesGeoJson = this.routesGeoJson
    const hoveredHub = this.hoveredHub
    return html`<div
      part="base"
      aria-label=${this.accessibleLabel ?? 'Route flow map'}
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
          ? html`<uip-map-source id="flight-routes-source" type="geojson" .data=${routesGeoJson}>
              <uip-map-layer id="flight-routes-layer" type="line" .paint=${this.routeLinePaint}></uip-map-layer>
            </uip-map-source>`
          : null}
        ${hubs.map(
          (hub) => html`<uip-map-marker longitude=${hub.lng} latitude=${hub.lat} anchor="center" class="cursor-pointer select-none">
            <div
              class="relative flex flex-col items-center"
              @mouseenter=${() => (this.hoveredHub = hub)}
              @mouseleave=${() => (this.hoveredHub = null)}
              @click=${() => this.dispatchEvent(new CustomEvent('hub-click', { detail: hub, bubbles: true, composed: true }))}
            >
              <span
                class="size-2 rounded-full shadow-xs ring-2"
                style=${styleMap({
                  backgroundColor: hub.color || 'oklch(0.65 0.20 145)',
                  boxShadow: `0 0 8px ${hub.color || 'oklch(0.65 0.20 145)'}`,
                })}
              ></span>
              ${this.showHubLabels
                ? html`<span
                    class="border-border/80 bg-background/85 py-0.2 text-foreground mt-1 rounded border px-1 font-mono text-[9px] font-bold shadow-xs backdrop-blur-xs"
                    >${hub.id}</span
                  >`
                : null}
            </div>
          </uip-map-marker>`,
        )}
        ${routes.map((r) => {
          const pos = this.getVehiclePosition(r)
          if (!pos) return null
          const isSelected = activeRouteId === r.id
          return html`<uip-map-marker
            longitude=${pos[0]}
            latitude=${pos[1]}
            anchor="center"
            class=${cn(
              'cursor-pointer transition-transform select-none',
              isSelected ? 'z-30 scale-125' : 'z-20 hover:scale-110',
            )}
          >
            <div
              class="flex items-center gap-1 rounded-full border border-sky-400/40 bg-sky-950/80 px-1.5 py-0.5 shadow-md backdrop-blur-xs"
              @click=${() => this.handleSelectRoute(r)}
            >
              ${icon(Plane, 'plane', 'size-3 rotate-45 text-sky-400')}
              <span class="font-mono text-[9px] font-semibold text-sky-200">${r.callsign || r.id}</span>
            </div>
          </uip-map-marker>`
        })}
      </uip-map>

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

      ${activeRoute
        ? html`<div
            class="border-border/80 bg-card/95 animate-in fade-in slide-in-from-bottom-2 absolute bottom-3 left-3 z-10 max-w-sm rounded-xl border p-3.5 shadow-lg backdrop-blur-md duration-150"
          >
            <div class="flex items-start justify-between gap-3">
              <div>
                <div class="flex items-center gap-2">
                  <span class="size-2 animate-pulse rounded-full bg-sky-400"></span>
                  <span class="text-foreground font-mono text-xs font-semibold tracking-wider uppercase">
                    ${activeRoute.callsign || activeRoute.id}
                  </span>
                  <span class="py-0.2 rounded bg-sky-500/10 px-1.5 font-mono text-[10px] text-sky-400 capitalize">
                    ${activeRoute.status || 'En-route'}
                  </span>
                </div>
                <div class="text-muted-foreground mt-1 flex items-center gap-2 font-mono text-xs">
                  <span>${activeRoute.from}</span>
                  <span>→</span>
                  <span>${activeRoute.to}</span>
                  ${activeRoute.aircraft ? html`<span class="text-[10px]">(${activeRoute.aircraft})</span>` : null}
                </div>
              </div>
              <button type="button" class="text-muted-foreground hover:text-foreground text-xs" @click=${this.clearRoute}>
                ✕
              </button>
            </div>

            <div class="border-border/60 mt-3 grid grid-cols-3 gap-2 border-t pt-2 font-mono text-[11px]">
              <div>
                <span class="text-muted-foreground block text-[9px] uppercase">Speed</span>
                <span class="text-foreground font-semibold">${activeRoute.speed || '480 kts'}</span>
              </div>
              <div>
                <span class="text-muted-foreground block text-[9px] uppercase">Altitude</span>
                <span class="text-foreground font-semibold">${activeRoute.altitude || 'FL360'}</span>
              </div>
              <div>
                <span class="text-muted-foreground block text-[9px] uppercase">ETA</span>
                <span class="text-foreground font-semibold">${activeRoute.eta || '02h 15m'}</span>
              </div>
            </div>
          </div>`
        : null}
      ${hoveredHub
        ? html`<div
            class="border-border/80 bg-card/95 animate-in fade-in slide-in-from-bottom-2 absolute right-3 bottom-3 z-10 max-w-xs rounded-xl border p-3 shadow-lg backdrop-blur-md duration-150"
          >
            <div class="flex items-center gap-2">
              <span
                class="size-2 rounded-full"
                style=${styleMap({ backgroundColor: hoveredHub.color || 'oklch(0.65 0.20 145)' })}
              ></span>
              <h5 class="text-foreground text-xs font-semibold">${hoveredHub.name} (${hoveredHub.id})</h5>
            </div>
            ${hoveredHub.latency
              ? html`<div class="mt-1.5 flex items-baseline justify-between font-mono text-xs">
                  <span class="text-muted-foreground">Turnaround</span>
                  <span class="text-foreground font-semibold">${hoveredHub.latency}</span>
                </div>`
              : null}
          </div>`
        : null}
    </div>`
  }
}

customElements.get('uip-route-flow-map') || customElements.define('uip-route-flow-map', UipRouteFlowMap)

declare global {
  interface HTMLElementTagNameMap {
    'uip-route-flow-map': UipRouteFlowMap
  }
}
