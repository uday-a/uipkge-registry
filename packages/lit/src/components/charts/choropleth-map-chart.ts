import { LitElement, css, html } from 'lit'
import { styleMap } from 'lit/directives/style-map.js'
import { Globe } from 'lucide'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import { icon } from '../../lib/icon'
import { heightToStyle } from './lib/chart-theme'
import { defaultTrue } from './lib/chart-element'
import '../map/map'
import type { MapVariant } from '../map/map.variants'

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
 * <uip-choropleth-map-chart> — the registry ChoroplethMapChart (React
 * `ChoroplethMapChart`) as a web component. Same fill/stroke/link layers,
 * pins, projection toggle and scale legend as React, rendered on the shipped
 * <uip-map> (declarative sources, layers and markers as its light-DOM
 * children — the web-component stand-in for React's JSX children).
 *
 * Properties (React props): `geo-json` (FeatureCollection; property or JSON
 * attribute), `map-name` (default 'uipkge-map'; accepted like React, unused),
 * `data` ({ id, value, name? }[]), `id-field` (default 'id'; accepted like
 * React, unused), `pins`, `links`, `show-scale` (default true;
 * `show-scale="false"` hides it), `height` (default 420), `center` (default
 * [0, 20]), `zoom` (default 1.5), `variant` (default 'dark'), `projection`
 * (initial 'globe' | 'mercator'), `aria-label` (React `ariaLabel`).
 * `access-token` forwards a Mapbox token to the inner map (elements never
 * read the environment). React's `className` → host classes.
 */
export class UipChoroplethMapChart extends LitElement {
  // :host display can't be a utility class (the host has no template of its own).
  static styles = [tailwind, css`:host { display: block; }`]

  static properties = {
    geoJson: { attribute: 'geo-json', type: Object },
    mapName: { attribute: 'map-name' },
    data: { type: Array },
    idField: { attribute: 'id-field' },
    pins: { type: Array },
    links: { type: Array },
    showScale: { attribute: 'show-scale', converter: defaultTrue },
    height: {},
    center: { type: Array },
    zoom: { type: Number },
    variant: {},
    projection: {},
    accessToken: { attribute: 'access-token' },
    accessibleLabel: { attribute: 'aria-label' },
  }

  geoJson?: any
  mapName = 'uipkge-map'
  data: ChoroplethDatum[] = []
  idField: 'id' | 'name' = 'id'
  pins: ChoroplethPin[] = []
  links: ChoroplethLink[] = []
  showScale = true
  height: number | string = 420
  center: [number, number] = [0, 20]
  zoom = 1.5
  variant: MapVariant = 'dark'
  projection: 'globe' | 'mercator' = 'globe'
  accessToken?: string
  accessibleLabel?: string

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'choropleth-map-chart')
  }

  private get dataMap() {
    const map = new Map<string, number>()
    for (const d of this.data ?? []) {
      map.set(String(d.id).toLowerCase(), d.value)
      if (d.name) map.set(String(d.name).toLowerCase(), d.value)
    }
    return map
  }

  private get values() {
    return (this.data ?? []).map((d) => d.value)
  }

  private get enrichedGeoJson() {
    const geoJson = this.geoJson
    if (!geoJson || !geoJson.features) return geoJson
    const dataMap = this.dataMap
    const features = geoJson.features.map((f: any) => {
      const idVal = f.id !== undefined ? String(f.id).toLowerCase() : ''
      const nameVal = f.properties?.name ? String(f.properties.name).toLowerCase() : ''
      const matchedVal = dataMap.get(idVal) ?? dataMap.get(nameVal) ?? null

      return {
        ...f,
        properties: {
          ...f.properties,
          value: matchedVal,
          title: f.properties?.name || f.id || 'Region',
        },
      }
    })

    return {
      ...geoJson,
      features,
    }
  }

  private get fillPaint() {
    const values = this.values
    const minValue = values.length ? Math.min(...values) : 0
    const maxValue = values.length ? Math.max(...values) : 100
    return {
      'fill-color': [
        'case',
        ['!=', ['get', 'value'], null],
        [
          'interpolate',
          ['linear'],
          ['get', 'value'],
          minValue,
          'rgba(56, 189, 248, 0.25)',
          maxValue,
          'rgba(56, 189, 248, 0.9)',
        ],
        'rgba(255, 255, 255, 0.04)',
      ] as any,
      'fill-opacity': 0.85,
    }
  }

  private get linksGeoJson() {
    const links = this.links ?? []
    if (!links.length) return null
    return {
      type: 'FeatureCollection',
      features: links.map((link) => ({
        type: 'Feature',
        properties: { label: link.label },
        geometry: {
          type: 'LineString',
          coordinates: [link.from, link.to],
        },
      })),
    }
  }

  private toggleProjection() {
    this.projection = this.projection === 'globe' ? 'mercator' : 'globe'
  }

  render() {
    const values = this.values
    const minValue = values.length ? Math.min(...values) : 0
    const maxValue = values.length ? Math.max(...values) : 100
    const linksGeoJson = this.linksGeoJson
    return html`<div
      part="base"
      aria-label=${this.accessibleLabel ?? 'Choropleth map'}
      style=${styleMap({ height: heightToStyle(this.height) })}
      class="border-border bg-card group relative w-full overflow-hidden rounded-xl border shadow-xs"
    >
      <uip-map
        .accessToken=${this.accessToken}
        .variant=${this.variant}
        .projection=${this.projection}
        .center=${this.center}
        .zoom=${this.zoom}
        class="size-full"
      >
        <uip-map-source id="choropleth-source" type="geojson" .data=${this.enrichedGeoJson}>
          <uip-map-layer id="choropleth-fill" type="fill" .paint=${this.fillPaint}></uip-map-layer>
          <uip-map-layer
            id="choropleth-stroke"
            type="line"
            .paint=${{ 'line-color': 'rgba(255, 255, 255, 0.25)', 'line-width': 1 }}
          ></uip-map-layer>
        </uip-map-source>

        ${linksGeoJson
          ? html`<uip-map-source id="choropleth-links-source" type="geojson" .data=${linksGeoJson}>
              <uip-map-layer
                id="choropleth-links"
                type="line"
                .paint=${{ 'line-color': 'rgba(245, 158, 11, 0.75)', 'line-width': 2, 'line-dasharray': [2, 2] }}
              ></uip-map-layer>
            </uip-map-source>`
          : null}
        ${(this.pins ?? []).map(
          (pin) => html`<uip-map-marker longitude=${pin.coord[0]} latitude=${pin.coord[1]} anchor="bottom">
            <div class="flex flex-col items-center">
              <span
                class="size-3 rounded-full shadow-md ring-4"
                style=${styleMap({
                  backgroundColor: pin.color || 'oklch(0.65 0.20 145)',
                  boxShadow: `0 0 10px ${pin.color || 'oklch(0.65 0.20 145)'}`,
                })}
              ></span>
              <span
                class="border-border/80 bg-background/90 mt-1 rounded border px-1.5 py-0.5 font-mono text-[10px] font-semibold shadow-xs backdrop-blur-xs"
                >${pin.name}</span
              >
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

      ${this.showScale && values.length > 0
        ? html`<div
            class="border-border/70 bg-card/85 absolute right-3 bottom-3 z-10 hidden items-center gap-2.5 rounded-lg border px-3 py-2 text-xs shadow-xs backdrop-blur-md sm:flex"
          >
            <span class="text-muted-foreground font-mono text-[11px]">Range</span>
            <span class="text-muted-foreground font-mono text-[10px]">${minValue}</span>
            <div class="h-2 w-24 rounded-full bg-gradient-to-r from-sky-400/30 to-sky-400"></div>
            <span class="text-foreground font-mono text-[10px] font-semibold">${maxValue}</span>
          </div>`
        : null}
    </div>`
  }
}

customElements.get('uip-choropleth-map-chart') ||
  customElements.define('uip-choropleth-map-chart', UipChoroplethMapChart)

declare global {
  interface HTMLElementTagNameMap {
    'uip-choropleth-map-chart': UipChoroplethMapChart
  }
}
