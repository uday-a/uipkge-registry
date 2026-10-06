import { LitElement, css, html } from 'lit'
import { styleMap } from 'lit/directives/style-map.js'
import { Globe } from 'lucide'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import { icon } from '../../lib/icon'
import { heightToStyle, toCanvasColor } from './lib/chart-theme'
import { defaultTrue } from './lib/chart-element'
import '../map/map'
import type { MapVariant } from '../map/map.variants'

// Mapbox GL paint needs a concrete color — resolve `var(--token)` values
// (the natural way to pass theme colors) via getComputedStyle first.
function resolvePaintColor(value: string): string {
  const match = value.trim().match(/^var\(\s*(--[\w-]+)\s*\)$/)
  const name = match?.[1]
  if (!name || typeof window === 'undefined') return value
  const resolved = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return resolved ? toCanvasColor(resolved) : value
}

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

/**
 * <uip-dotted-map-chart> — the registry DottedMapChart (React
 * `DottedMapChart`) as a web component. Same dot grid, routes, pulsing pins
 * and hover card as React, rendered on the shipped <uip-map> (declarative
 * sources, layers and markers as its light-DOM children — the
 * web-component stand-in for React's JSX children).
 *
 * Properties (React props): `pins`, `routes`, `map` ('world' | 'usa';
 * default 'world'), `grid` ('vertical' | 'diagonal'; accepted like React,
 * unused), `shape` ('circle' | 'hexagon'; accepted like React, unused),
 * `dot-color` (default 'rgba(255, 255, 255, 0.22)'), `pulse` (default true;
 * `pulse="false"` disables the ping), `height` (default 420), `interactive`
 * (default true), `variant` (default 'dark'), `projection` (initial 'globe'
 * | 'mercator'), `aria-label` (React `ariaLabel`). `access-token` forwards a
 * Mapbox token to the inner map (elements never read the environment).
 * React's `className` → host classes.
 *
 * Events: `pin-click` (detail: the MapPin — React's `onPinClick`),
 * `pin-hover` (detail: MapPin | null — React's `onPinHover`).
 */
export class UipDottedMapChart extends LitElement {
  // :host display can't be a utility class (the host has no template of its own).
  static styles = [tailwind, css`:host { display: block; }`]

  static properties = {
    pins: { type: Array },
    routes: { type: Array },
    map: {},
    grid: {},
    shape: {},
    dotColor: { attribute: 'dot-color' },
    pulse: { converter: defaultTrue },
    height: {},
    interactive: { converter: defaultTrue },
    variant: {},
    projection: {},
    accessToken: { attribute: 'access-token' },
    accessibleLabel: { attribute: 'aria-label' },
    hoveredPin: { state: true },
  }

  pins: MapPin[] = []
  routes: MapRoute[] = []
  map: 'world' | 'usa' = 'world'
  grid: 'vertical' | 'diagonal' = 'vertical'
  shape: 'circle' | 'hexagon' = 'circle'
  dotColor = 'rgba(255, 255, 255, 0.22)'
  pulse = true
  height: number | string = 420
  interactive = true
  variant: MapVariant = 'dark'
  projection: 'globe' | 'mercator' = 'globe'
  accessToken?: string
  accessibleLabel?: string
  private hoveredPin: MapPin | null = null

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'dotted-map-chart')
  }

  private get mapCenter(): [number, number] {
    return this.map === 'usa' ? [-98, 39] : [0, 20]
  }

  private get mapZoom() {
    return this.map === 'usa' ? 3.5 : 1.5
  }

  private get dotGridGeoJson() {
    const features: any[] = []
    const step = this.map === 'usa' ? 3 : 6
    const latMin = this.map === 'usa' ? 25 : -55
    const latMax = this.map === 'usa' ? 50 : 70
    const lngMin = this.map === 'usa' ? -125 : -170
    const lngMax = this.map === 'usa' ? -66 : 170

    for (let lat = latMin; lat <= latMax; lat += step) {
      for (let lng = lngMin; lng <= lngMax; lng += step) {
        features.push({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [lng, lat],
          },
        })
      }
    }

    return {
      type: 'FeatureCollection',
      features,
    }
  }

  private get routesGeoJson() {
    const routes = this.routes ?? []
    if (!routes.length) return null
    return {
      type: 'FeatureCollection',
      features: routes.map((r, i) => ({
        type: 'Feature',
        id: i,
        properties: {
          color: r.color || 'rgba(56, 189, 248, 0.75)',
          dashed: r.dashed ?? true,
        },
        geometry: {
          type: 'LineString',
          coordinates: [
            [r.from.lng, r.from.lat],
            [(r.from.lng + r.to.lng) / 2, (r.from.lat + r.to.lat) / 2 + 5],
            [r.to.lng, r.to.lat],
          ],
        },
      })),
    }
  }

  private hoverPin(pin: MapPin | null) {
    this.hoveredPin = pin
    this.dispatchEvent(new CustomEvent('pin-hover', { detail: pin, bubbles: true, composed: true }))
  }

  private clickPin(pin: MapPin) {
    this.dispatchEvent(new CustomEvent('pin-click', { detail: pin, bubbles: true, composed: true }))
  }

  private toggleProjection() {
    this.projection = this.projection === 'globe' ? 'mercator' : 'globe'
  }

  render() {
    const routesGeoJson = this.routesGeoJson
    const hoveredPin = this.hoveredPin
    return html`<div
      part="base"
      aria-label=${this.accessibleLabel ?? 'Dotted map'}
      style=${styleMap({ height: heightToStyle(this.height) })}
      class="border-border bg-card group relative w-full overflow-hidden rounded-xl border shadow-xs"
    >
      <uip-map
        .accessToken=${this.accessToken}
        .variant=${this.variant}
        .projection=${this.projection}
        .center=${this.mapCenter}
        .zoom=${this.mapZoom}
        class="size-full"
      >
        <uip-map-source id="dot-grid-source" type="geojson" .data=${this.dotGridGeoJson}>
          <uip-map-layer
            id="dot-grid-layer"
            type="circle"
            .paint=${{
              'circle-radius': 1.5,
              'circle-color': resolvePaintColor(this.dotColor || 'rgba(255, 255, 255, 0.22)'),
              'circle-opacity': 0.4,
            }}
          ></uip-map-layer>
        </uip-map-source>

        ${routesGeoJson
          ? html`<uip-map-source id="routes-source" type="geojson" .data=${routesGeoJson}>
              <uip-map-layer
                id="routes-layer"
                type="line"
                .paint=${{ 'line-color': ['get', 'color'] as any, 'line-width': 1.5, 'line-dasharray': [2, 2] }}
              ></uip-map-layer>
            </uip-map-source>`
          : null}
        ${(this.pins ?? []).map(
          (pin) => html`<uip-map-marker longitude=${pin.lng} latitude=${pin.lat} anchor="center" class="cursor-pointer select-none">
            <div
              class="relative flex size-6 items-center justify-center"
              @mouseenter=${() => this.hoverPin(pin)}
              @mouseleave=${() => this.hoverPin(null)}
              @click=${() => this.clickPin(pin)}
            >
              ${this.pulse
                ? html`<span
                    class="absolute inline-flex size-full animate-ping rounded-full opacity-60"
                    style=${styleMap({ backgroundColor: pin.color || 'oklch(0.65 0.20 145)' })}
                  ></span>`
                : null}
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

      ${hoveredPin && this.interactive
        ? html`<div
            class="border-border/80 bg-card/95 animate-in fade-in slide-in-from-bottom-2 absolute bottom-3 left-3 z-10 max-w-xs rounded-xl border p-3 shadow-lg backdrop-blur-md duration-150"
          >
            <div class="flex items-center gap-2">
              <span
                class="size-2 rounded-full"
                style=${styleMap({ backgroundColor: hoveredPin.color || 'oklch(0.65 0.20 145)' })}
              ></span>
              <h5 class="text-foreground text-xs font-semibold">${hoveredPin.label || 'Telemetry Node'}</h5>
            </div>
            ${hoveredPin.description
              ? html`<p class="text-muted-foreground mt-1 text-xs">${hoveredPin.description}</p>`
              : null}
            ${hoveredPin.value !== undefined
              ? html`<div
                  class="border-border/60 mt-2 flex items-baseline justify-between border-t pt-1.5 font-mono text-xs"
                >
                  <span class="text-muted-foreground">Value</span>
                  <span class="text-foreground font-semibold">${hoveredPin.value}</span>
                </div>`
              : null}
          </div>`
        : null}
    </div>`
  }
}

customElements.get('uip-dotted-map-chart') || customElements.define('uip-dotted-map-chart', UipDottedMapChart)

declare global {
  interface HTMLElementTagNameMap {
    'uip-dotted-map-chart': UipDottedMapChart
  }
}
