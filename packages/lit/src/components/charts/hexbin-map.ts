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

export interface HexState {
  id: string
  name: string
  col: number
  row: number
}

export interface HexbinDatum {
  value: number
  status?: 'leader' | 'active' | 'growing' | 'developing' | 'neutral'
  description?: string
  color?: string
}

export const US_HEX_STATES: HexState[] = [
  { id: 'AK', name: 'Alaska', col: 0, row: 0 },
  { id: 'ME', name: 'Maine', col: 11, row: 0 },
  { id: 'WA', name: 'Washington', col: 1, row: 1 },
  { id: 'ID', name: 'Idaho', col: 2, row: 1 },
  { id: 'MT', name: 'Montana', col: 3, row: 1 },
  { id: 'ND', name: 'North Dakota', col: 4, row: 1 },
  { id: 'MN', name: 'Minnesota', col: 5, row: 1 },
  { id: 'IL', name: 'Illinois', col: 6, row: 1 },
  { id: 'WI', name: 'Wisconsin', col: 7, row: 1 },
  { id: 'MI', name: 'Michigan', col: 8, row: 1 },
  { id: 'NY', name: 'New York', col: 9, row: 1 },
  { id: 'VT', name: 'Vermont', col: 10, row: 1 },
  { id: 'NH', name: 'New Hampshire', col: 11, row: 1 },
  { id: 'OR', name: 'Oregon', col: 1, row: 2 },
  { id: 'NV', name: 'Nevada', col: 2, row: 2 },
  { id: 'WY', name: 'Wyoming', col: 3, row: 2 },
  { id: 'SD', name: 'South Dakota', col: 4, row: 2 },
  { id: 'IA', name: 'Iowa', col: 5, row: 2 },
  { id: 'IN', name: 'Indiana', col: 6, row: 2 },
  { id: 'OH', name: 'Ohio', col: 7, row: 2 },
  { id: 'PA', name: 'Pennsylvania', col: 8, row: 2 },
  { id: 'NJ', name: 'New Jersey', col: 9, row: 2 },
  { id: 'MA', name: 'Massachusetts', col: 10, row: 2 },
  { id: 'RI', name: 'Rhode Island', col: 11, row: 2 },
  { id: 'CA', name: 'California', col: 1, row: 3 },
  { id: 'UT', name: 'Utah', col: 2, row: 3 },
  { id: 'CO', name: 'Colorado', col: 3, row: 3 },
  { id: 'NE', name: 'Nebraska', col: 4, row: 3 },
  { id: 'MO', name: 'Missouri', col: 5, row: 3 },
  { id: 'KY', name: 'Kentucky', col: 6, row: 3 },
  { id: 'WV', name: 'West Virginia', col: 7, row: 3 },
  { id: 'VA', name: 'Virginia', col: 8, row: 3 },
  { id: 'MD', name: 'Maryland', col: 9, row: 3 },
  { id: 'DE', name: 'Delaware', col: 10, row: 3 },
  { id: 'AZ', name: 'Arizona', col: 2, row: 4 },
  { id: 'NM', name: 'New Mexico', col: 3, row: 4 },
  { id: 'KS', name: 'Kansas', col: 4, row: 4 },
  { id: 'AR', name: 'Arkansas', col: 5, row: 4 },
  { id: 'TN', name: 'Tennessee', col: 6, row: 4 },
  { id: 'NC', name: 'North Carolina', col: 7, row: 4 },
  { id: 'SC', name: 'South Carolina', col: 8, row: 4 },
  { id: 'DC', name: 'District of Columbia', col: 9, row: 4 },
  { id: 'CT', name: 'Connecticut', col: 10, row: 4 },
  { id: 'OK', name: 'Oklahoma', col: 4, row: 5 },
  { id: 'LA', name: 'Louisiana', col: 5, row: 5 },
  { id: 'MS', name: 'Mississippi', col: 6, row: 5 },
  { id: 'AL', name: 'Alabama', col: 7, row: 5 },
  { id: 'GA', name: 'Georgia', col: 8, row: 5 },
  { id: 'HI', name: 'Hawaii', col: 0, row: 6 },
  { id: 'TX', name: 'Texas', col: 4, row: 6 },
  { id: 'FL', name: 'Florida', col: 8, row: 6 },
]

export const WORLD_HEX_REGIONS: HexState[] = [
  { id: 'CA', name: 'Canada', col: 2, row: 0 },
  { id: 'GL', name: 'Greenland', col: 4, row: 0 },
  { id: 'NO', name: 'Nordics', col: 6, row: 0 },
  { id: 'US-W', name: 'US West', col: 1, row: 1 },
  { id: 'US-E', name: 'US East', col: 2, row: 1 },
  { id: 'UK', name: 'United Kingdom', col: 5, row: 1 },
  { id: 'EU-W', name: 'Western Europe', col: 6, row: 1 },
  { id: 'EU-E', name: 'Eastern Europe', col: 7, row: 1 },
  { id: 'RU', name: 'Northern Eurasia', col: 8, row: 1 },
  { id: 'MX', name: 'Mexico', col: 1, row: 2 },
  { id: 'MED', name: 'Mediterranean', col: 6, row: 2 },
  { id: 'ME', name: 'Middle East', col: 7, row: 2 },
  { id: 'CN', name: 'East Asia', col: 8, row: 2 },
  { id: 'JP', name: 'Japan', col: 9, row: 2 },
  { id: 'BR', name: 'Brazil', col: 2, row: 3 },
  { id: 'AF-N', name: 'North Africa', col: 5, row: 3 },
  { id: 'IN', name: 'South Asia', col: 7, row: 3 },
  { id: 'SEA', name: 'Southeast Asia', col: 8, row: 3 },
  { id: 'AR', name: 'South Cone', col: 2, row: 4 },
  { id: 'AF-S', name: 'Sub-Saharan', col: 5, row: 4 },
  { id: 'AU', name: 'Australia & Oceania', col: 8, row: 4 },
]

const US_CENTROIDS: Record<string, [number, number]> = {
  AK: [-152.4, 64.2],
  ME: [-69.4, 45.3],
  WA: [-120.7, 47.7],
  ID: [-114.7, 44.1],
  MT: [-110.4, 46.9],
  ND: [-100.5, 47.5],
  MN: [-94.6, 46.7],
  IL: [-89.4, 40.6],
  WI: [-89.6, 43.8],
  MI: [-85.6, 44.3],
  NY: [-74.2, 43.3],
  VT: [-72.6, 44.6],
  NH: [-71.6, 43.2],
  OR: [-120.5, 43.8],
  NV: [-116.4, 38.8],
  WY: [-107.3, 43.1],
  SD: [-99.9, 44.3],
  IA: [-93.5, 42.0],
  IN: [-86.1, 40.3],
  OH: [-82.9, 40.4],
  PA: [-77.2, 41.2],
  NJ: [-74.4, 40.1],
  MA: [-71.4, 42.4],
  RI: [-71.5, 41.6],
  CA: [-119.4, 36.8],
  UT: [-111.1, 39.3],
  CO: [-105.8, 39.5],
  NE: [-99.9, 41.5],
  MO: [-91.8, 37.9],
  KY: [-84.3, 37.8],
  WV: [-80.4, 38.6],
  VA: [-78.7, 37.4],
  MD: [-76.6, 39.0],
  DE: [-75.5, 39.0],
  AZ: [-111.1, 34.0],
  NM: [-106.0, 34.5],
  KS: [-98.5, 38.5],
  AR: [-92.3, 34.8],
  TN: [-86.6, 35.5],
  NC: [-79.0, 35.8],
  SC: [-81.2, 33.8],
  DC: [-77.0, 38.9],
  CT: [-72.7, 41.6],
  OK: [-97.5, 35.0],
  LA: [-91.9, 30.9],
  MS: [-89.7, 32.4],
  AL: [-86.9, 32.3],
  GA: [-83.6, 32.2],
  HI: [-157.8, 21.3],
  TX: [-99.9, 31.9],
  FL: [-81.5, 27.6],
}

function getCoords(item: HexState): [number, number] {
  if (US_CENTROIDS[item.id]) return US_CENTROIDS[item.id]
  const lng = -120 + item.col * 14
  const lat = 50 - item.row * 8
  return [lng, lat]
}

/**
 * <uip-hexbin-map> — the registry HexbinMap (React `HexbinMap`) as a web
 * component. Same hex/square tiles, selection card, projection toggle and
 * ramp legend as React, rendered on the shipped <uip-map> (markers as its
 * light-DOM children — the web-component stand-in for React's JSX children).
 *
 * Properties (React props): `shape` ('hexagon' | 'square'; default
 * 'hexagon'), `preset` ('us-states' | 'world-regions'; default 'us-states'),
 * `items` (HexState[]; defaults to the preset), `data` (Record<id,
 * HexbinDatum>), `selected`, `show-labels` (default true; accepted like
 * React, unused), `show-values` (default false), `value-formatter` (property
 * only — a function), `color-ramp` (default green oklch ramp), `empty-color`
 * (default 'rgba(255, 255, 255, 0.08)'), `height` (default 480), `interactive`
 * (default true), `aria-label` (React `ariaLabel`). `access-token` forwards a
 * Mapbox token to the inner map (elements never read the environment).
 * React's `className` → host classes.
 *
 * Events: `selected-change` (detail: id | undefined — React's
 * `onSelectedChange`), `select` (detail: { id, name, datum } — React's
 * `onSelect`).
 */
export class UipHexbinMap extends LitElement {
  // :host display can't be a utility class (the host has no template of its own).
  static styles = [tailwind, css`:host { display: block; }`]

  static properties = {
    shape: {},
    preset: {},
    items: { type: Array },
    data: { type: Object },
    selected: {},
    showLabels: { attribute: 'show-labels', converter: defaultTrue },
    showValues: { attribute: 'show-values', type: Boolean },
    valueFormatter: { attribute: false },
    colorRamp: { attribute: 'color-ramp', type: Array },
    emptyColor: { attribute: 'empty-color' },
    height: {},
    interactive: { converter: defaultTrue },
    accessToken: { attribute: 'access-token' },
    accessibleLabel: { attribute: 'aria-label' },
    internalSelected: { state: true },
    projection: { state: true },
  }

  shape: 'hexagon' | 'square' = 'hexagon'
  preset: 'us-states' | 'world-regions' = 'us-states'
  items?: HexState[]
  data: Record<string, HexbinDatum> = {}
  selected?: string
  showLabels = true
  showValues = false
  valueFormatter: (value: number) => string = (v: number) => v.toLocaleString()
  colorRamp = [
    'oklch(0.92 0.05 162)',
    'oklch(0.82 0.10 162)',
    'oklch(0.72 0.14 162)',
    'oklch(0.62 0.17 162)',
    'oklch(0.50 0.18 162)',
    'oklch(0.38 0.16 162)',
  ]
  emptyColor = 'rgba(255, 255, 255, 0.08)'
  height: number | string = 480
  interactive = true
  accessToken?: string
  accessibleLabel?: string
  private internalSelected?: string
  private projection: 'globe' | 'mercator' = 'mercator'

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'hexbin-map')
    if (this.internalSelected === undefined) this.internalSelected = this.selected
    this.projection = this.preset === 'world-regions' ? 'globe' : 'mercator'
  }

  private get activeSelected() {
    return this.selected !== undefined ? this.selected : this.internalSelected
  }

  private get activeItems() {
    if (this.items && this.items.length > 0) return this.items
    return this.preset === 'world-regions' ? WORLD_HEX_REGIONS : US_HEX_STATES
  }

  private get values() {
    return Object.values(this.data ?? {})
      .map((d) => d.value)
      .filter((v) => typeof v === 'number')
  }

  private getColor(datum?: HexbinDatum): string {
    if (!datum) return this.emptyColor
    if (datum.color) return datum.color

    const values = this.values
    const minValue = values.length ? Math.min(...values) : 0
    const maxValue = values.length ? Math.max(...values) : 100
    const val = datum.value
    const span = maxValue - minValue
    const normalized = span > 0 ? (val - minValue) / span : 0.5
    const idx = Math.min(this.colorRamp.length - 1, Math.floor(normalized * this.colorRamp.length))
    return this.colorRamp[idx]
  }

  private handleSelect(item: HexState) {
    if (!this.interactive) return
    this.internalSelected = item.id
    this.dispatchEvent(new CustomEvent('selected-change', { detail: item.id, bubbles: true, composed: true }))
    this.dispatchEvent(
      new CustomEvent('select', { detail: { id: item.id, name: item.name, datum: this.data[item.id] }, bubbles: true, composed: true }),
    )
  }

  private clearSelection() {
    this.internalSelected = undefined
    this.dispatchEvent(new CustomEvent('selected-change', { detail: undefined, bubbles: true, composed: true }))
  }

  private toggleProjection() {
    this.projection = this.projection === 'globe' ? 'mercator' : 'globe'
  }

  render() {
    const activeItems = this.activeItems
    const activeSelected = this.activeSelected
    const activeStateItem = activeItems.find((it) => it.id === activeSelected)
    const activeStateDatum = activeSelected ? this.data[activeSelected] : undefined
    const values = this.values
    const minValue = values.length ? Math.min(...values) : 0
    const maxValue = values.length ? Math.max(...values) : 100
    const mapCenter: [number, number] = this.preset === 'world-regions' ? [0, 20] : [-97, 39]
    const mapZoom = this.preset === 'world-regions' ? 1.5 : 3.6
    return html`<div
      part="base"
      aria-label=${this.accessibleLabel ?? 'Hexbin map'}
      style=${styleMap({ height: heightToStyle(this.height) })}
      class="border-border bg-card group relative w-full overflow-hidden rounded-xl border shadow-xs"
    >
      <uip-map
        .accessToken=${this.accessToken}
        variant="dark"
        .projection=${this.projection}
        .center=${mapCenter}
        .zoom=${mapZoom}
        class="size-full"
      >
        ${activeItems.map((item) => {
          const coords = getCoords(item)
          const isSelected = activeSelected === item.id
          const color = this.getColor(this.data[item.id])
          return html`<uip-map-marker
            longitude=${coords[0]}
            latitude=${coords[1]}
            anchor="center"
            class=${cn(
              'cursor-pointer transition-transform select-none',
              isSelected ? 'z-30 scale-115' : 'z-20 hover:scale-105',
            )}
          >
            <button
              type="button"
              class="group/hex relative flex size-10 items-center justify-center font-mono"
              @click=${() => this.handleSelect(item)}
            >
              <div
                class="absolute inset-0 flex items-center justify-center"
                style=${styleMap({
                  clipPath: this.shape === 'hexagon' ? 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' : 'none',
                  backgroundColor: color,
                  border: isSelected ? '2px solid white' : '1px solid rgba(255,255,255,0.2)',
                  boxShadow: isSelected ? `0 0 14px ${color}` : 'none',
                })}
              ></div>

              <div class="relative z-10 flex flex-col items-center justify-center text-center">
                <span class="text-[10px] font-bold text-white drop-shadow-sm">${item.id}</span>
                ${this.showValues && this.data[item.id]
                  ? html`<span class="text-[8px] font-semibold text-white/90"
                      >${Math.round(this.data[item.id].value)}</span
                    >`
                  : null}
              </div>
            </button>
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

      ${activeStateItem
        ? html`<div
            class="border-border/80 bg-card/95 animate-in fade-in slide-in-from-bottom-2 absolute bottom-3 left-3 z-10 max-w-sm rounded-xl border p-3.5 shadow-lg backdrop-blur-md duration-150"
          >
            <div class="flex items-start justify-between gap-3">
              <div>
                <div class="flex items-center gap-2">
                  <span class="size-2 rounded-full" style=${styleMap({ backgroundColor: this.getColor(activeStateDatum) })}></span>
                  <span class="text-muted-foreground font-mono text-xs tracking-wider uppercase">
                    ${activeStateDatum?.status || 'Region'}
                  </span>
                </div>
                <h4 class="text-foreground mt-0.5 text-sm font-semibold">
                  ${activeStateItem.name} (${activeStateItem.id})
                </h4>
              </div>
              <button
                type="button"
                class="text-muted-foreground hover:text-foreground text-xs"
                @click=${this.clearSelection}
              >
                ✕
              </button>
            </div>

            ${activeStateDatum
              ? html`<div class="border-border/60 mt-2.5 flex items-baseline justify-between border-t pt-2 font-mono text-xs">
                  <span class="text-muted-foreground">Adoption Metric</span>
                  <span class="text-foreground font-semibold">${this.valueFormatter(activeStateDatum.value)}%</span>
                </div>`
              : null}
            ${activeStateDatum?.description
              ? html`<p class="text-muted-foreground mt-1.5 text-xs leading-relaxed">${activeStateDatum.description}</p>`
              : null}
          </div>`
        : null}
      ${values.length > 0
        ? html`<div
            class="border-border/70 bg-card/85 absolute right-3 bottom-3 z-10 hidden items-center gap-2 rounded-lg border px-3 py-2 text-xs shadow-xs backdrop-blur-md sm:flex"
          >
            <span class="text-muted-foreground font-mono text-[10px]">${minValue}</span>
            <div class="flex h-2.5 gap-0.5 overflow-hidden rounded-xs">
              ${this.colorRamp.map((c) => html`<div class="w-3" style=${styleMap({ backgroundColor: c })}></div>`)}
            </div>
            <span class="text-foreground font-mono text-[10px] font-semibold">${maxValue}</span>
          </div>`
        : null}
    </div>`
  }
}

customElements.get('uip-hexbin-map') || customElements.define('uip-hexbin-map', UipHexbinMap)

declare global {
  interface HTMLElementTagNameMap {
    'uip-hexbin-map': UipHexbinMap
  }
}
