import { LitElement, css, html } from 'lit'
import { styleMap } from 'lit/directives/style-map.js'
import { Globe } from 'lucide'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import { icon } from '../../lib/icon'
import { cn } from '../../lib/utils'
import { defaultTrue } from './lib/chart-element'
import '../map/map'
import type { MapVariant } from '../map/map.variants'

export interface MapBubble {
  id: string
  name: string
  lat: number
  lng: number
  value: number
  formattedValue?: string
  category?: string
  status?: 'optimal' | 'warning' | 'destructive' | 'neutral' | 'active'
  color?: string
  pulse?: boolean
  description?: string
}

const STATUS_COLORS: Record<string, string> = {
  optimal: 'oklch(0.65 0.20 145)',
  active: 'oklch(0.60 0.20 250)',
  warning: 'oklch(0.75 0.18 65)',
  destructive: 'oklch(0.60 0.22 25)',
  neutral: 'oklch(0.65 0.05 240)',
}

function getBubbleColor(b: MapBubble): string {
  if (b.color) return b.color
  if (b.status && STATUS_COLORS[b.status]) return STATUS_COLORS[b.status]
  return 'oklch(0.60 0.20 250)'
}

export function projectPoint(lat: number, lng: number): { x: number; y: number } {
  const x = ((lng + 180) / 360) * 1000
  const y = ((90 - lat) / 180) * 500
  return { x, y }
}

export const CONTINENT_LANDMASSES: Array<{ id: string; name: string; d: string }> = []

/**
 * <uip-bubble-map> — the registry BubbleMap (React `BubbleMap`) as a web
 * component. Same proportional bubbles, selection card, projection toggle and
 * legend as React, rendered on the shipped <uip-map> (markers as its
 * light-DOM children — the web-component stand-in for React's JSX children).
 *
 * Properties (React props): `bubbles` (MapBubble[]), `min-radius` (default
 * 10), `max-radius` (default 42), `show-legend` (default true;
 * `show-legend="false"` hides it), `legend-title` (default 'Scale by
 * Magnitude'), `selected-id`, `interactive` (default true;
 * `interactive="false"` disables selection), `projection` (initial 'globe' |
 * 'mercator'), `variant` (default 'dark'), `center` (default [0, 20]), `zoom`
 * (default 1.5). `access-token` forwards a Mapbox token to the inner map
 * (elements never read the environment). React's `className` → host classes.
 *
 * Events: `selected-id-change` (detail: id | undefined — React's
 * `onSelectedIdChange`), `select` (detail: the MapBubble — React's `onSelect`).
 */
export class UipBubbleMap extends LitElement {
  // :host display can't be a utility class (the host has no template of its own).
  static styles = [tailwind, css`:host { display: block; }`]

  static properties = {
    bubbles: { type: Array },
    minRadius: { attribute: 'min-radius', type: Number },
    maxRadius: { attribute: 'max-radius', type: Number },
    showLegend: { attribute: 'show-legend', converter: defaultTrue },
    legendTitle: { attribute: 'legend-title' },
    selectedId: { attribute: 'selected-id' },
    interactive: { converter: defaultTrue },
    projection: {},
    variant: {},
    center: { type: Array },
    zoom: { type: Number },
    accessToken: { attribute: 'access-token' },
    internalSelectedId: { state: true },
  }

  bubbles: MapBubble[] = []
  minRadius = 10
  maxRadius = 42
  showLegend = true
  legendTitle = 'Scale by Magnitude'
  selectedId?: string
  interactive = true
  projection: 'globe' | 'mercator' = 'globe'
  variant: MapVariant = 'dark'
  center: [number, number] = [0, 20]
  zoom = 1.5
  accessToken?: string
  private internalSelectedId?: string

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'bubble-map')
    if (this.internalSelectedId === undefined) this.internalSelectedId = this.selectedId
  }

  private get activeId() {
    return this.selectedId !== undefined ? this.selectedId : this.internalSelectedId
  }

  private get minValue() {
    const values = (this.bubbles ?? []).map((b) => b.value)
    return values.length ? Math.min(...values) : 1
  }

  private get maxValue() {
    const values = (this.bubbles ?? []).map((b) => b.value)
    return values.length ? Math.max(...values) : 100
  }

  private getRadius(val: number): number {
    const { minValue, maxValue, minRadius, maxRadius } = this
    if (maxValue === minValue) return (minRadius + maxRadius) / 2
    const ratio = Math.sqrt(Math.max(0, val - minValue) / (maxValue - minValue))
    return Math.round(minRadius + ratio * (maxRadius - minRadius))
  }

  private handleSelect(b: MapBubble) {
    if (!this.interactive) return
    this.internalSelectedId = b.id
    this.dispatchEvent(new CustomEvent('selected-id-change', { detail: b.id, bubbles: true, composed: true }))
    this.dispatchEvent(new CustomEvent('select', { detail: b, bubbles: true, composed: true }))
  }

  private clearSelection() {
    this.internalSelectedId = undefined
    this.dispatchEvent(new CustomEvent('selected-id-change', { detail: undefined, bubbles: true, composed: true }))
  }

  private toggleProjection() {
    this.projection = this.projection === 'globe' ? 'mercator' : 'globe'
  }

  render() {
    const bubbles = this.bubbles ?? []
    const activeId = this.activeId
    const activeBubble = bubbles.find((b) => b.id === activeId)
    return html`<div
      part="base"
      class="border-border bg-card group relative h-[420px] w-full overflow-hidden rounded-xl border shadow-xs"
    >
      <uip-map
        .accessToken=${this.accessToken}
        .variant=${this.variant}
        .projection=${this.projection}
        .center=${this.center}
        .zoom=${this.zoom}
        class="size-full"
      >
        ${bubbles.map((b) => {
          const radius = this.getRadius(b.value)
          const isSelected = activeId === b.id
          const color = getBubbleColor(b)
          return html`<uip-map-marker
            longitude=${b.lng}
            latitude=${b.lat}
            anchor="center"
            class=${cn('cursor-pointer transition-transform select-none', isSelected ? 'z-30 scale-110' : 'z-20 hover:scale-105')}
          >
            <div
              class="relative flex items-center justify-center"
              style=${styleMap({ width: `${radius * 2}px`, height: `${radius * 2}px` })}
              @click=${() => this.handleSelect(b)}
            >
              ${b.pulse
                ? html`<span
                    class="absolute inline-flex size-full animate-ping rounded-full opacity-40"
                    style=${styleMap({ backgroundColor: color })}
                  ></span>`
                : null}

              <div class="absolute inset-0 rounded-full opacity-25" style=${styleMap({ backgroundColor: color })}></div>

              <div
                class="relative flex size-4/5 items-center justify-center rounded-full border border-white/40 shadow-sm backdrop-blur-[1px] transition-[background-color,box-shadow]"
                style=${styleMap({
                  backgroundColor: color,
                  boxShadow: isSelected ? `0 0 16px ${color}` : 'none',
                })}
              >
                ${radius >= 20
                  ? html`<span class="px-1 text-center font-mono text-[10px] font-bold text-white drop-shadow-xs">
                      ${b.formattedValue || b.value}
                    </span>`
                  : html`<span class="size-1.5 rounded-full bg-white shadow-xs"></span>`}
              </div>
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

      ${activeBubble
        ? html`<div
            class="border-border/80 bg-card/95 animate-in fade-in slide-in-from-bottom-2 absolute bottom-3 left-3 z-10 max-w-sm rounded-xl border p-3.5 shadow-lg backdrop-blur-md duration-150"
          >
            <div class="flex items-start justify-between gap-3">
              <div>
                <div class="flex items-center gap-2">
                  <span
                    class="size-2 rounded-full ring-2 ring-white/20"
                    style=${styleMap({ backgroundColor: getBubbleColor(activeBubble) })}
                  ></span>
                  <span class="text-muted-foreground font-mono text-xs tracking-wider uppercase">
                    ${activeBubble.category || 'Node'}
                  </span>
                </div>
                <h4 class="text-foreground mt-0.5 text-sm font-semibold">${activeBubble.name}</h4>
              </div>
              <button
                type="button"
                class="text-muted-foreground hover:text-foreground text-xs"
                @click=${this.clearSelection}
              >
                ✕
              </button>
            </div>

            <div class="border-border/60 mt-2.5 flex items-baseline justify-between border-t pt-2 font-mono text-xs">
              <span class="text-muted-foreground">Magnitude</span>
              <span class="text-foreground font-semibold">
                ${activeBubble.formattedValue || activeBubble.value.toLocaleString()}
              </span>
            </div>

            ${activeBubble.description
              ? html`<p class="text-muted-foreground mt-1.5 text-xs leading-relaxed">${activeBubble.description}</p>`
              : null}
          </div>`
        : null}
      ${this.showLegend && bubbles.length > 0
        ? html`<div
            class="border-border/70 bg-card/85 absolute right-3 bottom-3 z-10 hidden items-center gap-3 rounded-lg border px-3 py-2 text-xs shadow-xs backdrop-blur-md sm:flex"
          >
            <span class="text-muted-foreground font-mono text-[11px]">${this.legendTitle}</span>
            <div class="flex items-center gap-2">
              <span class="bg-muted-foreground/40 size-2 rounded-full"></span>
              <span class="text-muted-foreground font-mono text-[10px]">${this.minValue.toLocaleString()}</span>
              <span class="bg-muted-foreground/60 size-4 rounded-full"></span>
              <span class="text-foreground font-mono text-[10px] font-semibold">${this.maxValue.toLocaleString()}</span>
            </div>
          </div>`
        : null}
    </div>`
  }
}

customElements.get('uip-bubble-map') || customElements.define('uip-bubble-map', UipBubbleMap)

declare global {
  interface HTMLElementTagNameMap {
    'uip-bubble-map': UipBubbleMap
  }
}
