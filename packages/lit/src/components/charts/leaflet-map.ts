import { LitElement, css, html, isServer, nothing, unsafeCSS } from 'lit'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'
import type * as L from 'leaflet'
import { cva, type VariantProps } from 'class-variance-authority'
import leafletCss from 'leaflet/dist/leaflet.css?inline'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import { icon } from '../../lib/icon'
import { Minus, Plus, RotateCcw } from 'lucide'
import { buttonVariants } from '../button/button.variants'
import { badgeVariants, type BadgeVariants } from '../badge/badge.variants'

type LeafletModule = typeof import('leaflet')
let leafletPromise: Promise<LeafletModule> | null = null

/** Leaflet touches `window`/`document` at import time — load it lazily so SSR
 *  renders never evaluate the module. */
function loadLeaflet(): Promise<LeafletModule> {
  if (!leafletPromise) leafletPromise = import('leaflet')
  return leafletPromise
}

/** [lng, lat] (Mapbox order, matching the `map` component) -> Leaflet [lat, lng]. */
function toLatLng(c: [number, number]): L.LatLngExpression {
  return [c[1], c[0]]
}
function toLatLngs(path: [number, number][] | [number, number][][]): L.LatLngExpression[] | L.LatLngExpression[][] {
  if (!path.length) return []
  return Array.isArray(path[0][0])
    ? (path as [number, number][][]).map((ring) => ring.map(toLatLng))
    : (path as [number, number][]).map(toLatLng)
}
function toLatLngBounds(bounds: [[number, number], [number, number]]): L.LatLngBoundsExpression {
  return [toLatLng(bounds[0]), toLatLng(bounds[1])] as L.LatLngBoundsExpression
}
type LeafletPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

/** Leaflet merges options by assignment, so an explicit `undefined` clobbers
 *  its defaults (e.g. `subdomains: 'abc'` -> crash, `icon: undefined` kills the
 *  default pin). Strip undefined keys before handing options to Leaflet. */
function defined<T extends object>(o: T): T {
  return Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined)) as T
}

const LEAFLET_ICON_BASE = 'https://unpkg.com/leaflet@1.9.4/dist/images'
let defaultIconFixed = false
/** Leaflet's default pin references image paths bundlers can't resolve. */
function fixDefaultLeafletIcon(leaflet: LeafletModule) {
  if (defaultIconFixed) return
  defaultIconFixed = true
  leaflet.Icon.Default.mergeOptions({
    iconRetinaUrl: `${LEAFLET_ICON_BASE}/marker-icon-2x.png`,
    iconUrl: `${LEAFLET_ICON_BASE}/marker-icon.png`,
    shadowUrl: `${LEAFLET_ICON_BASE}/marker-shadow.png`,
  })
}

// ── Variants + tile presets (verbatim copy of React's leaflet-map.variants.ts;
// inlined because charts/ items ship as one flat file) ───────────────────────

export type LeafletMapVariant =
  | 'default'
  | 'muted'
  | 'streets'
  | 'outdoors'
  | 'light'
  | 'dark'
  | 'satellite'
  | 'satellite-streets'
  | 'navigation-day'
  | 'navigation-night'
  | 'standard'

export interface LeafletTilePreset {
  /** Raster tile URL template ({z}/{x}/{y}, optional {s} subdomains + {r} retina). */
  url: string
  /** Required provider attribution HTML. */
  attribution: string
  subdomains?: string | string[]
  maxZoom?: number
  /** Optional label/boundary overlay composited above the base tiles. */
  overlayUrl?: string
}

const OSM_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
const TOPO_ATTR = `${OSM_ATTR} | map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)`
const ESRI_ATTR = 'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community'

const OSM_STANDARD: LeafletTilePreset = {
  url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution: OSM_ATTR,
  maxZoom: 19,
}
// CARTO basemaps moved behind an API key — Esri Canvas/Street services stay key-free.
const ESRI_LIGHT: LeafletTilePreset = {
  url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
  attribution: ESRI_ATTR,
  maxZoom: 16,
  overlayUrl:
    'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}',
}
const ESRI_DARK: LeafletTilePreset = {
  url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
  attribution: ESRI_ATTR,
  maxZoom: 16,
  overlayUrl:
    'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}',
}
const ESRI_STREETS: LeafletTilePreset = {
  url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
  attribution: ESRI_ATTR,
  maxZoom: 19,
}
const ESRI_SATELLITE: LeafletTilePreset = {
  url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  attribution: ESRI_ATTR,
  maxZoom: 19,
}

export const LEAFLET_TILES: Record<Exclude<LeafletMapVariant, 'default' | 'muted'>, LeafletTilePreset> = {
  streets: OSM_STANDARD,
  standard: OSM_STANDARD,
  outdoors: {
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: TOPO_ATTR,
    subdomains: 'abc',
    maxZoom: 17,
  },
  light: ESRI_LIGHT,
  dark: ESRI_DARK,
  satellite: ESRI_SATELLITE,
  'satellite-streets': {
    ...ESRI_SATELLITE,
    overlayUrl:
      'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
  },
  'navigation-day': ESRI_STREETS,
  'navigation-night': ESRI_DARK,
}

/** Theme-aware default tiles: Esri light/dark canvas following the app theme. */
export const LEAFLET_THEME_TILES = { light: ESRI_LIGHT, dark: ESRI_DARK }

export const leafletMapVariants = cva('relative size-full overflow-hidden bg-muted isolate', {
  variants: {
    variant: {
      default: '',
      muted: '',
      streets: '',
      outdoors: '',
      light: '',
      dark: '',
      satellite: '',
      'satellite-streets': '',
      'navigation-day': '',
      'navigation-night': '',
      standard: '',
    },
    size: {
      default: 'h-96 w-full',
      sm: 'h-64 w-full',
      lg: 'h-[500px] w-full',
      xl: 'h-[650px] w-full',
      full: 'size-full',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

export type LeafletMapVariants = VariantProps<typeof leafletMapVariants>

// ── Chrome CSS (verbatim copy of React's leaflet-map.css; the
// [data-slot][data-muted] rule keeps working because the inner root div
// carries the same data-slot/data-muted attributes as React's root) ──────────

const leafletChrome = css`
  .leaflet-container {
    font: inherit;
    background: var(--muted);
  }
  .leaflet-bar {
    border: 1px solid var(--border);
    border-radius: var(--radius);
    box-shadow: var(--shadow-sm);
  }
  .leaflet-bar a,
  .leaflet-bar a:hover {
    background: var(--card);
    color: var(--foreground);
    border-bottom-color: var(--border);
  }
  .leaflet-bar a:hover {
    background: var(--muted);
  }
  .leaflet-bar a.leaflet-disabled {
    background: var(--card);
    color: var(--muted-foreground);
  }
  .leaflet-popup-content-wrapper {
    background: var(--popover);
    color: var(--popover-foreground);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    box-shadow: var(--shadow-md);
  }
  .leaflet-popup-content {
    margin: var(--spacing-2, 8px) var(--spacing-3, 12px);
    font: inherit;
    line-height: 1.5;
  }
  .leaflet-popup-tip {
    background: var(--popover);
    border: 1px solid var(--border);
    box-shadow: none;
  }
  .leaflet-popup-close-button {
    color: var(--muted-foreground) !important;
  }
  .leaflet-tooltip {
    background: var(--popover);
    color: var(--popover-foreground);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    box-shadow: var(--shadow-sm);
    font: inherit;
  }
  .leaflet-tooltip-top:before {
    border-top-color: var(--border);
  }
  .leaflet-tooltip-bottom:before {
    border-bottom-color: var(--border);
  }
  [data-slot='leaflet-map'][data-muted='true'] .leaflet-tile-pane {
    filter: grayscale(55%) contrast(0.92);
  }
  .uipkge-leaflet-div-icon {
    background: transparent;
    border: none;
    width: auto !important;
    height: auto !important;
    margin: 0 !important;
  }
  .uipkge-leaflet-anchor {
    display: none;
  }
  .leaflet-marker-icon .uipkge-leaflet-anchor {
    display: block;
    width: max-content;
  }
  .uipkge-leaflet-anchor[data-anchor='center'] {
    transform: translate(-50%, -50%);
  }
  .uipkge-leaflet-anchor[data-anchor='top'] {
    transform: translate(-50%, 0);
  }
  .uipkge-leaflet-anchor[data-anchor='bottom'] {
    transform: translate(-50%, -100%);
  }
  .uipkge-leaflet-anchor[data-anchor='left'] {
    transform: translate(0, -50%);
  }
  .uipkge-leaflet-anchor[data-anchor='right'] {
    transform: translate(-100%, -50%);
  }
  .uipkge-leaflet-anchor[data-anchor='top-left'] {
    transform: translate(0, 0);
  }
  .uipkge-leaflet-anchor[data-anchor='top-right'] {
    transform: translate(-100%, 0);
  }
  .uipkge-leaflet-anchor[data-anchor='bottom-left'] {
    transform: translate(0, -100%);
  }
  .uipkge-leaflet-anchor[data-anchor='bottom-right'] {
    transform: translate(-100%, -100%);
  }
  .uipkge-leaflet-popup-src,
  .uipkge-leaflet-tooltip-src {
    display: none;
  }
  .leaflet-popup-content .uipkge-leaflet-popup-src,
  .leaflet-tooltip .uipkge-leaflet-tooltip-src {
    display: block;
  }
`

/** `true` unless the attribute is absent or the string "false" — so defaults
 *  of `true` (navigation, attribution, scroll-wheel…) can be turned off in HTML. */
const boolAttr = { fromAttribute: (v: string | null) => v !== null && v !== 'false' }
/** Tri-state: absent → undefined (Leaflet's default), "false" → false, else true. */
const optionalBool = { fromAttribute: (v: string | null) => (v === null ? undefined : v !== 'false') }
/** `dash-array="6 4"` from markup, or a number[] from JS / JSON attribute. */
const dashArrayConverter = {
  fromAttribute: (v: string | null) => {
    if (v === null) return undefined
    const t = v.trim()
    if (t.startsWith('[')) return JSON.parse(t) as number[]
    return t
  },
}

const isDarkPage = () => !isServer && document.documentElement.classList.contains('dark')

/** Children notify their map when their properties change. */
function notifyMap(el: HTMLElement) {
  el.closest<UipLeafletMap>('uip-leaflet-map')?.requestSync()
}

function isOverlay(el: Node): el is UipLeafletPopup | UipLeafletTooltip {
  return el instanceof UipLeafletPopup || el instanceof UipLeafletTooltip
}

/** Non-empty content children (overlays bind to the layer instead of becoming
 *  icon content; whitespace text nodes don't count). */
function htmlKids(el: HTMLElement): Node[] {
  return [...el.childNodes].filter(
    (n) => !isOverlay(n) && (n.nodeType === 1 || (n.nodeType === 3 && (n.textContent?.trim() ?? '') !== '')),
  )
}

export interface LeafletFlyToOptions {
  /** [lng, lat] — Mapbox order. */
  center?: [number, number]
  zoom?: number
  /** Milliseconds (converted to Leaflet's seconds). */
  duration?: number
}
export interface LeafletViewOptions {
  center?: [number, number]
  zoom?: number
}

// ── <uip-leaflet-map> ─────────────────────────────────────────────────────────

/**
 * <uip-leaflet-map> — the registry LeafletMap as a web component. Same
 * key-free raster tiles, theme-aware default, zoom/fullscreen chrome and ⓘ
 * attribution as React. Leaflet is imported lazily (once the element is near
 * the viewport), disposed on disconnect, and resized by a ResizeObserver.
 * Leaflet's CSS and React's leaflet-map.css are adopted into the shadow root,
 * because Leaflet renders its panes and overlays there.
 *
 * Children (the web-component stand-in for React's JSX children):
 *  - `<uip-leaflet-marker>` — light-DOM content becomes the div icon (no
 *    content = Leaflet's default pin); nested popups/tooltips bind to it.
 *  - `<uip-leaflet-popup>` / `<uip-leaflet-tooltip>` — bind to the nearest
 *    ancestor layer, or float standalone at `lng-lat`. Once the map is created,
 *    a nested overlay is moved up to be a direct child of the map (slots can
 *    only project the host's own children); it moves back into its layer
 *    element if that layer is removed.
 *  - `<uip-leaflet-polyline>` / `-polygon` / `-circle` / `-circle-marker` /
 *    `-geo-json` / `-tile-layer` — declarative vector + raster layers.
 *
 * `center` / `zoom` are the initial view; later changes call setView (React's
 * watcher). The theme that picks the default tiles is hand-rolled from
 * <html class="dark"> (React's next-themes equivalent).
 *
 * Events: `created` (detail: { map }) once the map is created — React's
 * `onCreated`. The raw instance is also on the `map` property, plus the
 * imperative helpers `flyTo`/`setView`/`jumpTo`/`fitBounds`/`panTo`/`zoomIn`/
 * `zoomOut`/`resize` (React's LeafletMapRef).
 */
export class UipLeafletMap extends LitElement {
  // Manual slot assignment: each marker/popup/tooltip child is assigned to a
  // <slot> created inside its Leaflet container (same pattern as <uip-map>).
  static shadowRootOptions = { ...LitElement.shadowRootOptions, slotAssignment: 'manual' as const }
  static styles = [tailwind, unsafeCSS(leafletCss), leafletChrome, css`:host { display: block; }`]

  static properties = {
    variant: { reflect: true },
    size: { reflect: true },
    tileUrl: { attribute: 'tile-url' },
    tileAttribution: { attribute: 'tile-attribution' },
    tileSubdomains: { attribute: 'tile-subdomains' },
    center: { type: Array },
    zoom: { type: Number },
    minZoom: { attribute: 'min-zoom', type: Number },
    maxZoom: { attribute: 'max-zoom', type: Number },
    navigation: { converter: boolAttr },
    navigationPosition: { attribute: 'navigation-position' },
    fullscreen: { type: Boolean },
    fullscreenPosition: { attribute: 'fullscreen-position' },
    attribution: { converter: boolAttr },
    scrollWheelZoom: { attribute: 'scroll-wheel-zoom', converter: boolAttr },
    muted: { type: Boolean },
    mapReady: { state: true },
    isFullscreen: { state: true },
    canZoomIn: { state: true },
    canZoomOut: { state: true },
    attributions: { state: true },
    showAttribution: { state: true },
    isDark: { state: true },
  }

  variant: LeafletMapVariant = 'default'
  /** Height preset. Omit to size the host with classes. */
  size?: LeafletMapVariants['size']
  /** Custom raster tile URL template — overrides `variant`. */
  tileUrl?: string
  /** Attribution HTML for a custom `tileUrl`. Defaults to the OpenStreetMap credit. */
  tileAttribution?: string
  /** Tile subdomains for a custom `tileUrl`. */
  tileSubdomains?: string | string[]
  /** Initial [lng, lat] — Mapbox order, matching the `map` component. */
  center: [number, number] = [0, 20]
  zoom = 2
  minZoom?: number
  /** Caps the map's max zoom. Defaults to the tile provider's own maxZoom. */
  maxZoom?: number
  /** Show the zoom control. */
  navigation = true
  navigationPosition: LeafletPosition = 'bottom-right'
  /** Show the HTML5 fullscreen toggle button. */
  fullscreen = false
  fullscreenPosition: LeafletPosition = 'top-right'
  /** Show tile credits behind a ⓘ button. Keep on — OSM/Esri tiles require attribution. */
  attribution = true
  /** Wheel zoom. Set false for maps embedded in scrollable pages. */
  scrollWheelZoom = true
  /** Desaturate the tile pane to a quiet canvas (markers stay coloured). */
  muted = false
  private mapReady = false
  private isFullscreen = false
  private canZoomIn = true
  private canZoomOut = true
  private attributions: string[] = []
  private showAttribution = false
  private isDark = false

  private leaflet?: LeafletModule
  private instance?: L.Map
  private initializing = false
  private inView = false
  private io?: IntersectionObserver
  private ro?: ResizeObserver
  private themeObserver?: MutationObserver
  private childObserver?: MutationObserver
  private baseLayer?: L.TileLayer | null
  private overlayLayer?: L.TileLayer | null
  private layers = new Map<Element, L.Layer>()
  private layerKeys = new Map<Element, string>()
  private overlayKeys = new Map<Element, string>()
  private overlayContent = new Map<Element, HTMLElement>()
  private geoJsonData = new Map<Element, unknown>()
  private syncQueued = false
  private tilesKey?: string

  constructor() {
    super()
    new ThemeController(this)
  }

  /** The raw Leaflet Map once created (React's `ref.map`). */
  get map(): L.Map | null {
    return this.instance ?? null
  }
  getMap(): L.Map | null {
    return this.instance ?? null
  }
  flyTo(options: LeafletFlyToOptions = {}) {
    const m = this.instance
    if (!m) return
    m.flyTo(options.center ? toLatLng(options.center) : m.getCenter(), options.zoom ?? m.getZoom(), {
      duration: (options.duration ?? 800) / 1000,
    })
  }
  setView(options: LeafletViewOptions = {}) {
    const m = this.instance
    if (!m) return
    m.setView(options.center ? toLatLng(options.center) : m.getCenter(), options.zoom ?? m.getZoom())
  }
  jumpTo(options: LeafletViewOptions = {}) {
    const m = this.instance
    if (!m) return
    m.setView(options.center ? toLatLng(options.center) : m.getCenter(), options.zoom ?? m.getZoom(), { animate: false })
  }
  fitBounds(bounds: [[number, number], [number, number]] | L.LatLngBoundsExpression, options?: L.FitBoundsOptions) {
    this.instance?.fitBounds(toLatLngBounds(bounds as [[number, number], [number, number]]), options)
  }
  panTo(c: [number, number]) {
    this.instance?.panTo(toLatLng(c))
  }
  zoomIn() {
    this.instance?.zoomIn()
  }
  zoomOut() {
    this.instance?.zoomOut()
  }
  resize() {
    this.instance?.invalidateSize()
  }

  private get isMuted() {
    return this.muted || this.variant === 'muted'
  }

  private get resolvedTiles(): LeafletTilePreset {
    if (this.tileUrl) {
      return {
        url: this.tileUrl,
        attribution:
          this.tileAttribution ??
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        subdomains: this.tileSubdomains,
        maxZoom: this.maxZoom,
      }
    }
    if (
      this.variant &&
      this.variant !== 'default' &&
      this.variant !== 'muted' &&
      LEAFLET_TILES[this.variant as keyof typeof LEAFLET_TILES]
    ) {
      return LEAFLET_TILES[this.variant as keyof typeof LEAFLET_TILES]
    }
    return this.isDark ? LEAFLET_THEME_TILES.dark : LEAFLET_THEME_TILES.light
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'leaflet-map')
    this.isDark = isDarkPage()
    this.themeObserver = new MutationObserver(() => (this.isDark = isDarkPage()))
    this.themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    document.addEventListener('fullscreenchange', this.onFullscreenChange)
    this.childObserver = new MutationObserver(() => this.requestSync())
    this.childObserver.observe(this, { childList: true, subtree: true })
    if (this.hasUpdated) this.observeViewport()
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.themeObserver?.disconnect()
    this.childObserver?.disconnect()
    document.removeEventListener('fullscreenchange', this.onFullscreenChange)
    this.io?.disconnect()
    this.ro?.disconnect()
    this.destroy()
  }

  private onFullscreenChange = () => {
    this.isFullscreen = Boolean(document.fullscreenElement)
  }

  protected firstUpdated() {
    this.observeViewport()
    const ro = (this.ro = new ResizeObserver(() => this.instance?.invalidateSize()))
    ro.observe(this)
  }

  private observeViewport() {
    if (typeof IntersectionObserver === 'undefined') {
      this.inView = true
      return void this.init()
    }
    this.io?.disconnect()
    this.io = new IntersectionObserver(
      ([entry]) => {
        // Latch like <uip-map>: the observer only defers the first paint.
        if (!entry.isIntersecting) return
        this.inView = true
        this.io?.disconnect()
        this.init()
      },
      { rootMargin: '160px', threshold: 0.01 },
    )
    this.io.observe(this)
  }

  private async init() {
    if (!this.inView || this.instance || this.initializing || !this.isConnected) return
    this.initializing = true
    try {
      const leaflet = (this.leaflet ??= await loadLeaflet())
      await this.updateComplete
      const container = this.renderRoot.querySelector<HTMLElement>('[data-leaflet-container]')
      if (!container || !this.isConnected) return
      fixDefaultLeafletIcon(leaflet)
      const tiles = this.resolvedTiles
      const m = leaflet.map(
        container,
        defined({
          center: toLatLng(this.center),
          zoom: this.zoom,
          minZoom: this.minZoom,
          maxZoom: this.maxZoom ?? tiles.maxZoom,
          zoomControl: false,
          attributionControl: false,
          scrollWheelZoom: this.scrollWheelZoom,
        }),
      )
      this.instance = m
      this.tilesKey = JSON.stringify(tiles)
      this.applyTiles(tiles)
      m.on('zoomend', this.syncZoomBounds)
      this.syncZoomBounds()
      m.on('layeradd layerremove', this.collectAttributions)
      this.collectAttributions()
      this.mapReady = true
      this.syncChildren()
      this.dispatchEvent(new CustomEvent('created', { detail: { map: m }, bubbles: true, composed: true }))
    } finally {
      this.initializing = false
    }
  }

  private syncZoomBounds = () => {
    const m = this.instance
    if (!m) return
    this.canZoomIn = m.getZoom() < m.getMaxZoom()
    this.canZoomOut = m.getZoom() > m.getMinZoom()
  }

  private collectAttributions = () => {
    const m = this.instance
    if (!m) return
    const seen = new Set<string>()
    m.eachLayer((layer) => {
      const a = (layer as L.TileLayer).options?.attribution
      if (typeof a === 'string' && a) seen.add(a)
    })
    this.attributions = [...seen]
  }

  private applyTiles(tiles: LeafletTilePreset) {
    const m = this.instance
    const leaflet = this.leaflet
    if (!m || !leaflet) return
    this.baseLayer?.remove()
    this.baseLayer = null
    this.overlayLayer?.remove()
    this.overlayLayer = null
    this.baseLayer = leaflet.tileLayer(
      tiles.url,
      defined({
        attribution: tiles.attribution,
        subdomains: tiles.subdomains,
        maxZoom: tiles.maxZoom ?? 19,
      }),
    )
    this.baseLayer.addTo(m)
    if (tiles.overlayUrl) {
      this.overlayLayer = leaflet.tileLayer(tiles.overlayUrl, { maxZoom: tiles.maxZoom ?? 19 })
      this.overlayLayer.addTo(m)
    }
    this.collectAttributions()
  }

  private destroy() {
    this.instance?.remove()
    this.instance = undefined
    this.baseLayer = this.overlayLayer = null
    this.layers.clear()
    this.layerKeys.clear()
    this.overlayKeys.clear()
    this.overlayContent.clear()
    this.geoJsonData.clear()
    this.mapReady = false
  }

  protected updated(changed: Map<string, unknown>) {
    const tiles = this.resolvedTiles
    const key = JSON.stringify(tiles)
    if (this.instance && key !== this.tilesKey) {
      this.tilesKey = key
      this.applyTiles(tiles)
    }
    if (this.instance && (changed.has('center') || changed.has('zoom')) && this.center) {
      this.instance.setView(toLatLng(this.center), this.zoom)
    }
    if (changed.has('attribution') && !this.attribution) this.showAttribution = false
    if (this.instance && changed.has('scrollWheelZoom')) {
      if (this.scrollWheelZoom) this.instance.scrollWheelZoom.enable()
      else this.instance.scrollWheelZoom.disable()
    }
  }

  /** Batched: re-reconcile children with the Leaflet instance. */
  requestSync() {
    if (this.syncQueued) return
    this.syncQueued = true
    queueMicrotask(() => {
      this.syncQueued = false
      this.syncChildren()
    })
  }

  /** A <slot> inside a Leaflet-owned container, manually assigned to `el`. */
  private slotFor(el: HTMLElement, cls?: string, anchor?: string) {
    const holder = document.createElement('div')
    if (cls) holder.className = cls
    if (anchor) holder.dataset.anchor = anchor
    const slot = document.createElement('slot')
    holder.append(slot)
    slot.assign(el)
    return holder
  }

  private layerChildren(): Element[] {
    return [...this.children].filter(
      (k) =>
        k instanceof UipLeafletMarker ||
        k instanceof UipLeafletPolyline ||
        k instanceof UipLeafletPolygon ||
        k instanceof UipLeafletCircle ||
        k instanceof UipLeafletCircleMarker ||
        k instanceof UipLeafletGeoJson ||
        k instanceof UipLeafletTileLayer,
    )
  }

  /**
   * Nested overlays (a popup inside a marker) can't be slotted into the
   * Leaflet popup/tooltip containers in this shadow root: manual slot
   * assignment only takes the host's direct children. So each nested overlay
   * is moved up to be a direct child of the map (still light DOM, so the
   * page's styles apply), remembering its layer element; it moves back into
   * that element if the layer leaves the map.
   */
  private hoistOverlays() {
    for (const el of [...this.children]) {
      const home = (el as any).__uipLayer as Element | undefined
      if (isOverlay(el) && home && home.parentElement !== this) {
        delete (el as any).__uipLayer
        home.append(el)
      }
    }
    for (const el of [...this.querySelectorAll('uip-leaflet-popup,uip-leaflet-tooltip')]) {
      if (el.parentElement === this) continue
      let layer: Element | null = el.parentElement
      while (layer && layer.parentElement !== this) layer = layer.parentElement
      if (!layer || !this.layerChildren().includes(layer)) continue
      ;(el as any).__uipLayer = layer
      this.append(el)
    }
  }

  private syncChildren() {
    const m = this.instance
    const leaflet = this.leaflet
    if (!m || !leaflet) return
    this.hoistOverlays()

    // Drop removed layers.
    const kids = this.layerChildren()
    for (const [el, layer] of this.layers) {
      if (!kids.includes(el)) {
        m.removeLayer(layer)
        this.layers.delete(el)
        this.layerKeys.delete(el)
      }
    }
    // Drop removed overlays.
    const overlayEls = [...this.querySelectorAll('uip-leaflet-popup,uip-leaflet-tooltip')] as (
      | UipLeafletPopup
      | UipLeafletTooltip
    )[]
    for (const [el, key] of this.overlayKeys) {
      void key
      if (!overlayEls.includes(el as UipLeafletPopup | UipLeafletTooltip)) {
        // Detached already, so resolve the bound layer from the remembered
        // parent (the live parent chain no longer reaches the map).
        try {
          const prevParent = (el as any).__uipParent as Element | null | undefined
          const prevLayer = prevParent ? this.layers.get(prevParent) : undefined
          if (el instanceof UipLeafletPopup) {
            if (prevLayer) (prevLayer as L.Marker).unbindPopup()
            else (this.layers.get(el) as L.Popup | undefined)?.remove()
          } else if (el instanceof UipLeafletTooltip) {
            if (prevLayer) (prevLayer as L.Marker).unbindTooltip()
            else (this.layers.get(el) as L.Tooltip | undefined)?.remove()
          }
        } catch {
          /* layer already gone */
        }
        this.overlayKeys.delete(el)
        this.overlayContent.delete(el)
        this.layers.delete(el)
      }
    }

    for (const el of kids) {
      if (el instanceof UipLeafletMarker) this.syncMarker(m, leaflet, el)
      else if (el instanceof UipLeafletPolyline) this.syncPath(m, leaflet, el, 'polyline')
      else if (el instanceof UipLeafletPolygon) this.syncPath(m, leaflet, el, 'polygon')
      else if (el instanceof UipLeafletCircle) this.syncPath(m, leaflet, el, 'circle')
      else if (el instanceof UipLeafletCircleMarker) this.syncPath(m, leaflet, el, 'circle-marker')
      else if (el instanceof UipLeafletGeoJson) this.syncGeoJson(m, leaflet, el)
      else if (el instanceof UipLeafletTileLayer) this.syncTileLayer(m, leaflet, el)
    }
    for (const el of overlayEls) {
      if (el instanceof UipLeafletPopup) this.syncPopup(m, leaflet, el)
      else if (el instanceof UipLeafletTooltip) this.syncTooltip(m, leaflet, el)
    }
    this.collectAttributions()
  }

  private overlayParent(el: UipLeafletPopup | UipLeafletTooltip): Element | null {
    // A hoisted overlay (see hoistOverlays) binds to the layer it came from.
    const home = (el as any).__uipLayer as Element | undefined
    if (home) return this.layers.has(home) ? home : null
    // Otherwise: nearest ancestor that is a direct layer child of the map.
    let node: Element | null = el.parentElement
    while (node && node.parentElement !== this) node = node.parentElement
    if (node && this.layers.has(node)) return node
    return null
  }

  private overlayLayerFor(el: UipLeafletPopup | UipLeafletTooltip): L.Layer | undefined {
    const parent = this.overlayParent(el)
    return parent ? this.layers.get(parent) : undefined
  }

  private syncMarker(m: L.Map, leaflet: LeafletModule, el: UipLeafletMarker) {
    const hasHtml = htmlKids(el).length > 0
    const key = JSON.stringify([el.anchor, hasHtml, el.markerDraggable, el.zIndexOffset, el.markerTitle, el.alt])
    let layer = this.layers.get(el) as L.Marker | undefined
    if (layer && this.layerKeys.get(el) !== key) {
      m.removeLayer(layer)
      this.layers.delete(el)
      layer = undefined
    }
    if (!layer) {
      layer = leaflet.marker(
        toLatLng(el.lngLat ?? [0, 0]),
        defined({
          icon: hasHtml
            ? leaflet.divIcon({ className: 'uipkge-leaflet-div-icon', html: this.slotFor(el, 'uipkge-leaflet-anchor', el.anchor) })
            : undefined,
          interactive: true,
          draggable: el.markerDraggable,
          zIndexOffset: el.zIndexOffset,
          title: el.markerTitle,
          alt: el.alt,
          opacity: el.opacity,
        }),
      )
      layer.on('click', (ev) => el.dispatchEvent(new CustomEvent('click', { detail: ev, bubbles: true, composed: true })))
      layer.addTo(m)
      this.layers.set(el, layer)
      this.layerKeys.set(el, key)
    }
    if (el.lngLat) layer.setLatLng(toLatLng(el.lngLat))
    if (el.opacity !== undefined) layer.setOpacity(el.opacity)
    if (el.zIndexOffset !== undefined) layer.setZIndexOffset(el.zIndexOffset)
  }

  private pathStyle(el: UipLeafletPath): L.PathOptions {
    return defined({
      color: el.color,
      weight: el.weight,
      opacity: el.opacity,
      lineCap: el.lineCap,
      lineJoin: el.lineJoin,
      dashArray: el.dashArray,
      dashOffset: el.dashOffset,
      fill: el.fill,
      fillColor: el.fillColor,
      fillOpacity: el.fillOpacity,
      className: el.pathClass,
    })
  }

  private syncPath(m: L.Map, leaflet: LeafletModule, el: UipLeafletPath, kind: 'polyline' | 'polygon' | 'circle' | 'circle-marker') {
    let layer = this.layers.get(el) as L.Path | undefined
    if (!layer) {
      const opts = { ...this.pathStyle(el), interactive: true }
      if (kind === 'polyline') {
        const p = el as UipLeafletPolyline
        layer = leaflet.polyline(toLatLngs(p.lngLatPath ?? []) as L.LatLngExpression[], {
          ...opts,
          smoothFactor: p.smoothFactor,
          noClip: p.noClip,
        })
      } else if (kind === 'polygon') {
        layer = leaflet.polygon(toLatLngs((el as UipLeafletPolygon).lngLatPath ?? []) as L.LatLngExpression[], opts)
      } else if (kind === 'circle') {
        const c = el as UipLeafletCircle
        layer = leaflet.circle(toLatLng(c.center ?? [0, 0]), { ...opts, radius: c.radius })
      } else {
        const c = el as UipLeafletCircleMarker
        layer = leaflet.circleMarker(toLatLng(c.center ?? [0, 0]), { ...opts, radius: c.radius })
      }
      layer.on('click', (ev: any) => el.dispatchEvent(new CustomEvent('click', { detail: ev, bubbles: true, composed: true })))
      layer.addTo(m)
      this.layers.set(el, layer)
    }
    if (kind === 'polyline' || kind === 'polygon') {
      const path = (el as UipLeafletPolyline | UipLeafletPolygon).lngLatPath ?? []
      ;(layer as L.Polyline).setLatLngs(toLatLngs(path) as L.LatLngExpression[])
    } else {
      const c = el as UipLeafletCircle | UipLeafletCircleMarker
      ;(layer as L.Circle).setLatLng(toLatLng(c.center ?? [0, 0]))
      if (c.radius !== undefined) (layer as L.Circle).setRadius(c.radius)
    }
    layer.setStyle({ ...this.pathStyle(el), interactive: true })
  }

  private syncGeoJson(m: L.Map, leaflet: LeafletModule, el: UipLeafletGeoJson) {
    let layer = this.layers.get(el) as L.GeoJSON | undefined
    if (!layer) {
      layer = leaflet.geoJSON(el.geojson as any, el.options)
      layer.on('click', (ev: any) => el.dispatchEvent(new CustomEvent('click', { detail: ev, bubbles: true, composed: true })))
      layer.addTo(m)
      this.layers.set(el, layer)
      this.geoJsonData.set(el, el.geojson)
      return
    }
    if (el.geojson && this.geoJsonData.get(el) !== el.geojson) {
      layer.clearLayers()
      layer.addData(el.geojson as any)
      this.geoJsonData.set(el, el.geojson)
    }
  }

  private syncTileLayer(m: L.Map, leaflet: LeafletModule, el: UipLeafletTileLayer) {
    const key = JSON.stringify([el.attribution, el.subdomains, el.minZoom, el.maxZoom, el.tms])
    let layer = this.layers.get(el) as L.TileLayer | undefined
    if (layer && this.layerKeys.get(el) !== key) {
      m.removeLayer(layer)
      this.layers.delete(el)
      layer = undefined
    }
    if (!layer) {
      layer = leaflet.tileLayer(
        el.url ?? '',
        defined({ attribution: el.attribution, subdomains: el.subdomains, minZoom: el.minZoom, maxZoom: el.maxZoom, tms: el.tms }),
      )
      layer.addTo(m)
      this.layers.set(el, layer)
      this.layerKeys.set(el, key)
    }
    if (el.url) layer.setUrl(el.url)
    if (el.opacity !== undefined) layer.setOpacity(el.opacity)
    if (el.zIndex !== undefined) layer.setZIndex(el.zIndex)
  }

  private overlayContentFor(el: UipLeafletPopup | UipLeafletTooltip, cls: string) {
    let holder = this.overlayContent.get(el)
    if (!holder) {
      holder = this.slotFor(el, cls)
      this.overlayContent.set(el, holder)
    }
    return holder
  }

  private syncPopup(m: L.Map, leaflet: LeafletModule, el: UipLeafletPopup) {
    const parent = this.overlayParent(el)
    const parentLayer = parent ? this.layers.get(parent) : undefined
    const key = JSON.stringify([parent ? [...this.children].indexOf(parent) : -1, el.lngLat, el.minWidth, el.maxWidth, el.offset, el.popupClass, el.autoClose, el.closeOnClick, el.closeButton, el.keepInView])
    if (this.overlayKeys.get(el) === key) return
    // Tear down the previous binding.
    const prevParent = (el as any).__uipParent as Element | null | undefined
    const prevLayer = prevParent ? this.layers.get(prevParent) : undefined
    try {
      if (prevLayer && el.lngLat == null) (prevLayer as any).unbindPopup?.()
      ;(this.layers.get(el as unknown as Element) as L.Popup | undefined)?.remove()
    } catch {
      /* map already destroyed */
    }
    this.layers.delete(el as unknown as Element)
    if (parentLayer) {
      ;(parentLayer as L.Marker).bindPopup(
        this.overlayContentFor(el, 'uipkge-leaflet-popup-src'),
        defined({ minWidth: el.minWidth, maxWidth: el.maxWidth, offset: el.offset as any, className: el.popupClass, autoClose: el.autoClose, closeOnClick: el.closeOnClick, closeButton: el.closeButton, keepInView: el.keepInView }) as L.PopupOptions,
      )
    } else if (el.lngLat) {
      const popup = leaflet
        .popup(
          defined({ minWidth: el.minWidth, maxWidth: el.maxWidth, offset: el.offset as any, className: el.popupClass, autoClose: el.autoClose, closeOnClick: el.closeOnClick, closeButton: el.closeButton, keepInView: el.keepInView }) as L.PopupOptions,
        )
        .setLatLng(toLatLng(el.lngLat))
        .setContent(this.overlayContentFor(el, 'uipkge-leaflet-popup-src'))
      popup.openOn(m)
      this.layers.set(el as unknown as Element, popup as unknown as L.Layer)
    }
    ;(el as any).__uipParent = parent
    this.overlayKeys.set(el, key)
  }

  private syncTooltip(m: L.Map, leaflet: LeafletModule, el: UipLeafletTooltip) {
    const parent = this.overlayParent(el)
    const parentLayer = parent ? this.layers.get(parent) : undefined
    const key = JSON.stringify([parent ? [...this.children].indexOf(parent) : -1, el.lngLat, el.offset, el.direction, el.permanent, el.sticky, el.opacity, el.tooltipClass, el.interactive])
    if (this.overlayKeys.get(el) === key) return
    const prevParent = (el as any).__uipParent as Element | null | undefined
    const prevLayer = prevParent ? this.layers.get(prevParent) : undefined
    try {
      if (prevLayer && el.lngLat == null) (prevLayer as any).unbindTooltip?.()
      ;(this.layers.get(el as unknown as Element) as L.Tooltip | undefined)?.remove()
    } catch {
      /* map already destroyed */
    }
    this.layers.delete(el as unknown as Element)
    if (parentLayer) {
      ;(parentLayer as L.Marker).bindTooltip(
        this.overlayContentFor(el, 'uipkge-leaflet-tooltip-src'),
        defined({ offset: el.offset as any, direction: el.direction, permanent: el.permanent, sticky: el.sticky, opacity: el.opacity, className: el.tooltipClass, interactive: el.interactive }) as L.TooltipOptions,
      )
    } else if (el.lngLat) {
      const tooltip = leaflet
        .tooltip(
          defined({ offset: el.offset as any, direction: el.direction, permanent: el.permanent, sticky: el.sticky, opacity: el.opacity, className: el.tooltipClass, interactive: el.interactive }) as L.TooltipOptions,
        )
        .setLatLng(toLatLng(el.lngLat))
        .setContent(this.overlayContentFor(el, 'uipkge-leaflet-tooltip-src'))
      tooltip.addTo(m)
      this.layers.set(el as unknown as Element, tooltip as unknown as L.Layer)
    }
    ;(el as any).__uipParent = parent
    this.overlayKeys.set(el, key)
  }

  private toggleFullscreen() {
    if (document.fullscreenElement) document.exitFullscreen()
    else (this as HTMLElement).requestFullscreen?.()
  }

  render() {
    const cornerClasses: Record<LeafletPosition, string> = {
      'top-left': 'left-3 top-3',
      'top-right': 'right-3 top-3',
      // above the ⓘ button (bottom-left) when credits are shown
      'bottom-left': this.attribution && this.attributions.length ? 'bottom-9 left-3' : 'bottom-3 left-3',
      'bottom-right': 'bottom-3 right-3',
    }
    const cornerOrder: LeafletPosition[] = ['top-left', 'top-right', 'bottom-left', 'bottom-right']
    const navPosition = this.navigationPosition ?? 'bottom-right'
    const fsPosition = this.fullscreenPosition ?? 'top-right'
    return html`<div
      part="base"
      data-slot="leaflet-map"
      data-variant=${this.variant}
      data-muted=${String(this.isMuted)}
      class=${cn(leafletMapVariants({ variant: this.variant, ...(this.size ? { size: this.size } : {}) }), 'rounded-[inherit]')}
    >
      <div data-leaflet-container class="size-full"></div>
      ${cornerOrder.map((corner) => {
        const showZoom = this.mapReady && this.navigation && navPosition === corner
        const showFullscreen = this.mapReady && this.fullscreen && fsPosition === corner
        if (!showZoom && !showFullscreen) return null
        return html`<div class=${cn('absolute z-[1000] flex flex-col gap-2.5', cornerClasses[corner])}>
          ${showZoom
            ? html`<div class="border-border bg-card divide-border flex flex-col divide-y overflow-hidden rounded-lg border shadow-sm">
                <button
                  type="button"
                  class="text-muted-foreground hover:bg-muted flex size-8 items-center justify-center transition-colors disabled:pointer-events-none disabled:opacity-40"
                  aria-label="Zoom in"
                  ?disabled=${!this.canZoomIn}
                  @click=${() => this.instance?.zoomIn()}
                >
                  <svg class="size-full" viewBox="0 0 29 29" fill="currentColor" aria-hidden="true">
                    <path
                      d="M14.5 8.5c-.75 0-1.5.75-1.5 1.5v3h-3c-.75 0-1.5.75-1.5 1.5S9.25 16 10 16h3v3c0 .75.75 1.5 1.5 1.5S16 19.75 16 19v-3h3c.75 0 1.5-.75 1.5-1.5S19.75 13 19 13h-3v-3c0-.75-.75-1.5-1.5-1.5z"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  class="text-muted-foreground hover:bg-muted flex size-8 items-center justify-center transition-colors disabled:pointer-events-none disabled:opacity-40"
                  aria-label="Zoom out"
                  ?disabled=${!this.canZoomOut}
                  @click=${() => this.instance?.zoomOut()}
                >
                  <svg class="size-full" viewBox="0 0 29 29" fill="currentColor" aria-hidden="true">
                    <path d="M10 13c-.75 0-1.5.75-1.5 1.5S9.25 16 10 16h9c.75 0 1.5-.75 1.5-1.5S19.75 13 19 13h-9z" />
                  </svg>
                </button>
              </div>`
            : null}
          ${showFullscreen
            ? html`<button
                type="button"
                class="border-border bg-card text-muted-foreground hover:bg-muted flex size-8 items-center justify-center rounded-lg border shadow-sm transition-colors"
                aria-label="Toggle fullscreen"
                @click=${this.toggleFullscreen}
              >
                <svg class="size-full" viewBox="0 0 29 29" fill="currentColor" aria-hidden="true">
                  ${this.isFullscreen
                    ? html`<path
                        d="M18.5 16c-1.75 0-2.5.75-2.5 2.5V24h1l1.5-3 5.5 4 1-1-4-5.5 3-1.5v-1h-5.5zM13 18.5c0-1.75-.75-2.5-2.5-2.5H5v1l3 1.5L4 24l1 1 5.5-4 1.5 3h1v-5.5zm3-8c0 1.75.75 2.5 2.5 2.5H24v-1l-3-1.5L25 5l-1-1-5.5 4L17 5h-1v5.5zM10.5 13c1.75 0 2.5-.75 2.5-2.5V5h-1l-1.5 3L5 4 4 5l4 5.5L5 12v1h5.5z"
                      />`
                    : html`<path
                        d="M24 16v5.5c0 1.75-.75 2.5-2.5 2.5H16v-1l3-1.5-4-5.5 1-1 5.5 4 1.5-3h1zM6 16l1.5 3 5.5-4 1 1-4 5.5 3 1.5v1H7.5C5.75 24 5 23.25 5 21.5V16h1zm7-11v1l-3 1.5 4 5.5-1 1-5.5-4L6 13H5V7.5C5 5.75 5.75 5 7.5 5H13zm11 2.5c0-1.75-.75-2.5-2.5-2.5H16v1l3 1.5-4 5.5 1 1 5.5-4 1.5 3h1V7.5z"
                      />`}
                </svg>
              </button>`
            : null}
        </div>`
      })}
      ${this.mapReady && this.attribution && this.attributions.length > 0
        ? html`<div class="group absolute bottom-3 left-3 z-[1000] flex flex-col items-start gap-1.5">
            <div
              role="note"
              class=${cn(
                'border-border bg-popover text-popover-foreground max-w-64 rounded-md border px-2.5 py-1.5 text-[11px] leading-relaxed shadow-md transition-opacity [&_a]:underline',
                this.showAttribution
                  ? 'visible opacity-100'
                  : 'invisible opacity-0 group-hover:visible group-hover:opacity-100',
              )}
            >
              ${unsafeHTML(this.attributions.join(' | '))}
            </div>
            <button
              type="button"
              class="border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground flex size-4 items-center justify-center rounded-full border shadow-xs transition-colors"
              aria-label="Map data attribution"
              aria-expanded=${String(this.showAttribution)}
              @click=${() => (this.showAttribution = !this.showAttribution)}
            >
              <svg
                class="size-3"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4M12 8h.01" />
              </svg>
            </button>
          </div>`
        : null}
    </div>`
  }
}

// ── Child elements ────────────────────────────────────────────────────────────

export type LeafletMarkerAnchor =
  | 'center'
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'

/**
 * <uip-leaflet-marker> — React's `LeafletMarker`. Place inside
 * `<uip-leaflet-map>`; its content becomes the div icon (no content =
 * Leaflet's default pin). Position with `lng-lat="[lng, lat]"`. Nested
 * popups/tooltips bind to the marker instead of becoming icon content.
 * Events: `click` when the marker is clicked (detail: the Leaflet event —
 * React's `onClick`).
 */
export class UipLeafletMarker extends LitElement {
  // Manual assignment: only non-overlay children render in the icon; nested
  // popups/tooltips are assigned by the map into their own overlay slots.
  static shadowRootOptions = { ...LitElement.shadowRootOptions, slotAssignment: 'manual' as const }
  static styles = [tailwind, css`:host { display: block; }`]

  static properties = {
    lngLat: { attribute: 'lng-lat', type: Array },
    anchor: {},
    markerDraggable: { attribute: 'marker-draggable', type: Boolean },
    opacity: { type: Number },
    zIndexOffset: { attribute: 'z-index-offset', type: Number },
    markerTitle: { attribute: 'marker-title' },
    alt: {},
  }

  /** [lng, lat] — Mapbox order, matching the `map` component's MapMarker. */
  lngLat?: [number, number]
  /** Which edge/corner of the marker content sits on the coordinate. */
  anchor: LeafletMarkerAnchor = 'center'
  /** Native `draggable` is taken by HTMLElement — this sets Leaflet's draggable. */
  markerDraggable?: boolean
  opacity?: number
  zIndexOffset?: number
  /** Native `title` is taken by HTMLElement — this sets Leaflet's title. */
  markerTitle?: string
  alt?: string

  private childObserver?: MutationObserver

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-slot', 'leaflet-marker')
    this.assignContent()
    this.childObserver = new MutationObserver(() => this.assignContent())
    this.childObserver.observe(this, { childList: true })
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.childObserver?.disconnect()
  }

  // connectedCallback runs before the first render, so the <slot> doesn't
  // exist yet there; assign again once it does.
  protected firstUpdated() {
    this.assignContent()
  }

  private assignContent() {
    const slot = this.renderRoot?.querySelector('slot')
    // Element children only (whitespace text nodes would still position fine,
    // but Text nodes assigned alongside Elements are harmless to skip).
    slot?.assign(...htmlKids(this).filter((n): n is Element => n.nodeType === 1))
  }

  protected updated() {
    notifyMap(this)
  }

  render() {
    return html`<slot></slot>`
  }
}

/**
 * <uip-leaflet-popup> — React's `LeafletPopup`. Binds to the nearest ancestor
 * layer, or opens standalone at `lng-lat`.
 */
export class UipLeafletPopup extends LitElement {
  static styles = [tailwind, css`:host { display: block; }`]

  static properties = {
    lngLat: { attribute: 'lng-lat', type: Array },
    maxWidth: { attribute: 'max-width', type: Number },
    minWidth: { attribute: 'min-width', type: Number },
    offset: { type: Array },
    popupClass: { attribute: 'popup-class' },
    autoClose: { attribute: 'auto-close', converter: optionalBool },
    closeOnClick: { attribute: 'close-on-click', converter: optionalBool },
    closeButton: { attribute: 'close-button', converter: optionalBool },
    keepInView: { attribute: 'keep-in-view', converter: optionalBool },
  }

  /** [lng, lat] — standalone popup on the map. Omit inside a layer to bind to it. */
  lngLat?: [number, number]
  maxWidth?: number
  /** Minimum popup width. Defaults to 200 — keeps card-style content from collapsing narrow. */
  minWidth = 200
  offset?: [number, number]
  /** Leaflet container class (React's `className`; `class`/`className` are taken by HTMLElement). */
  popupClass?: string
  // Leaflet's own defaults, declared explicitly (same as every framework's
  // LeafletPopup): one popup open at a time, closes on map click, has a close
  // button. `auto-close="false"` etc. turn them off.
  autoClose = true
  closeOnClick = true
  closeButton = true
  keepInView = false

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-slot', 'leaflet-popup')
  }

  protected updated() {
    notifyMap(this)
  }

  render() {
    return html`<slot></slot>`
  }
}

/**
 * <uip-leaflet-tooltip> — React's `LeafletTooltip`. Binds to the nearest
 * ancestor layer, or floats standalone at `lng-lat`.
 */
export class UipLeafletTooltip extends LitElement {
  static styles = [tailwind, css`:host { display: block; }`]

  static properties = {
    lngLat: { attribute: 'lng-lat', type: Array },
    offset: { type: Array },
    direction: {},
    permanent: { type: Boolean },
    sticky: { type: Boolean },
    opacity: { type: Number },
    tooltipClass: { attribute: 'tooltip-class' },
    interactive: { type: Boolean },
  }

  /** [lng, lat] — standalone tooltip on the map. Omit inside a layer to bind to it. */
  lngLat?: [number, number]
  offset?: [number, number]
  direction?: 'top' | 'bottom' | 'left' | 'right' | 'center' | 'auto'
  permanent?: boolean
  sticky?: boolean
  opacity?: number
  /** Leaflet container class (React's `className`; `class`/`className` are taken by HTMLElement). */
  tooltipClass?: string
  interactive?: boolean

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-slot', 'leaflet-tooltip')
  }

  protected updated() {
    notifyMap(this)
  }

  render() {
    return html`<slot></slot>`
  }
}

type UipLeafletPath = UipLeafletPolyline | UipLeafletPolygon | UipLeafletCircle | UipLeafletCircleMarker

/** Shared paint props for the vector children (React's LeafletPathProps). */
const pathProps = {
  color: {},
  weight: { type: Number },
  opacity: { type: Number },
  lineCap: { attribute: 'line-cap' },
  lineJoin: { attribute: 'line-join' },
  dashArray: { attribute: 'dash-array', converter: dashArrayConverter },
  dashOffset: { attribute: 'dash-offset' },
  fill: { type: Boolean },
  fillColor: { attribute: 'fill-color' },
  fillOpacity: { attribute: 'fill-opacity', type: Number },
  pathClass: { attribute: 'path-class' },
}

/**
 * <uip-leaflet-polyline> — React's `LeafletPolyline`. Path points as
 * `lng-lat-path="[[lng,lat],…]"` (or multi-part `[[[lng,lat],…]]`).
 * Events: `click` (detail: the Leaflet event — React's `onClick`).
 */
export class UipLeafletPolyline extends LitElement {
  static styles = [css`:host { display: none; }`]
  static properties = {
    ...pathProps,
    lngLatPath: { attribute: 'lng-lat-path', type: Array },
    smoothFactor: { attribute: 'smooth-factor', type: Number },
    noClip: { attribute: 'no-clip', type: Boolean },
  }

  lngLatPath?: [number, number][] | [number, number][][]
  smoothFactor?: number
  noClip?: boolean
  color?: string
  weight?: number
  opacity?: number
  lineCap?: 'butt' | 'round' | 'square'
  lineJoin?: 'miter' | 'round' | 'bevel'
  dashArray?: string | number[]
  dashOffset?: string
  fill?: boolean
  fillColor?: string
  fillOpacity?: number
  pathClass?: string

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-slot', 'leaflet-polyline')
  }

  protected updated() {
    notifyMap(this)
  }

  render() {
    return html``
  }
}

/**
 * <uip-leaflet-polygon> — React's `LeafletPolygon`. Ring points as
 * `lng-lat-path="[[lng,lat],…]"` (or with holes `[[[lng,lat],…]]`).
 * Events: `click` (detail: the Leaflet event — React's `onClick`).
 */
export class UipLeafletPolygon extends LitElement {
  static styles = [css`:host { display: none; }`]
  static properties = {
    ...pathProps,
    lngLatPath: { attribute: 'lng-lat-path', type: Array },
  }

  lngLatPath?: [number, number][] | [number, number][][]
  color?: string
  weight?: number
  opacity?: number
  lineCap?: 'butt' | 'round' | 'square'
  lineJoin?: 'miter' | 'round' | 'bevel'
  dashArray?: string | number[]
  dashOffset?: string
  fill?: boolean
  fillColor?: string
  fillOpacity?: number
  pathClass?: string

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-slot', 'leaflet-polygon')
  }

  protected updated() {
    notifyMap(this)
  }

  render() {
    return html``
  }
}

/**
 * <uip-leaflet-circle> — React's `LeafletCircle`. Meter-accurate coverage
 * rings: `center="[lng, lat]"` + `radius` in meters.
 * Events: `click` (detail: the Leaflet event — React's `onClick`).
 */
export class UipLeafletCircle extends LitElement {
  static styles = [css`:host { display: none; }`]
  static properties = {
    ...pathProps,
    center: { type: Array },
    radius: { type: Number },
  }

  /** [lng, lat] — Mapbox order. */
  center?: [number, number]
  /** Radius in meters. */
  radius?: number
  color?: string
  weight?: number
  opacity?: number
  lineCap?: 'butt' | 'round' | 'square'
  lineJoin?: 'miter' | 'round' | 'bevel'
  dashArray?: string | number[]
  dashOffset?: string
  fill?: boolean
  fillColor?: string
  fillOpacity?: number
  pathClass?: string

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-slot', 'leaflet-circle')
  }

  protected updated() {
    notifyMap(this)
  }

  render() {
    return html``
  }
}

/**
 * <uip-leaflet-circle-marker> — React's `LeafletCircleMarker`. Pixel-fixed
 * data points: `center="[lng, lat]"` + `radius` in pixels.
 * Events: `click` (detail: the Leaflet event — React's `onClick`).
 */
export class UipLeafletCircleMarker extends LitElement {
  static styles = [css`:host { display: none; }`]
  static properties = {
    ...pathProps,
    center: { type: Array },
    radius: { type: Number },
  }

  /** [lng, lat] — Mapbox order. */
  center?: [number, number]
  /** Radius in pixels. */
  radius?: number
  color?: string
  weight?: number
  opacity?: number
  lineCap?: 'butt' | 'round' | 'square'
  lineJoin?: 'miter' | 'round' | 'bevel'
  dashArray?: string | number[]
  dashOffset?: string
  fill?: boolean
  fillColor?: string
  fillOpacity?: number
  pathClass?: string

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-slot', 'leaflet-circle-marker')
  }

  protected updated() {
    notifyMap(this)
  }

  render() {
    return html``
  }
}

/**
 * <uip-leaflet-geo-json> — React's `LeafletGeoJson`. `geojson` (property or
 * JSON attribute) + Leaflet `options` (property only — `style`,
 * `pointToLayer`, `onEachFeature`, …).
 * Events: `click` (detail: the Leaflet event — React's `onClick`).
 */
export class UipLeafletGeoJson extends LitElement {
  static styles = [css`:host { display: none; }`]
  static properties = {
    geojson: { type: Object },
    options: { type: Object },
  }

  /** GeoJSON FeatureCollection / Feature / geometry. */
  geojson?: GeoJSON.GeoJSON
  /** Leaflet GeoJSON options: `style`, `pointToLayer`, `onEachFeature`, `filter`, `coordsToLatLng`. */
  options?: L.GeoJSONOptions

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-slot', 'leaflet-geo-json')
  }

  protected updated() {
    notifyMap(this)
  }

  render() {
    return html``
  }
}

/**
 * <uip-leaflet-tile-layer> — React's `LeafletTileLayer`. Extra raster layers
 * stacked above the basemap.
 */
export class UipLeafletTileLayer extends LitElement {
  static styles = [css`:host { display: none; }`]
  static properties = {
    url: {},
    attribution: {},
    subdomains: {},
    minZoom: { attribute: 'min-zoom', type: Number },
    maxZoom: { attribute: 'max-zoom', type: Number },
    opacity: { type: Number },
    zIndex: { attribute: 'z-index', type: Number },
    tms: { type: Boolean },
  }

  /** Raster tile URL template ({z}/{x}/{y}, optional {s} subdomains + {r} retina). */
  url?: string
  attribution?: string
  subdomains?: string | string[]
  minZoom?: number
  maxZoom?: number
  opacity?: number
  zIndex?: number
  tms?: boolean

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-slot', 'leaflet-tile-layer')
  }

  protected updated() {
    notifyMap(this)
  }

  render() {
    return html``
  }
}

// ── <uip-leaflet-map-controls> ────────────────────────────────────────────────

/**
 * <uip-leaflet-map-controls> — LeafletMapControls: a zoom in / zoom out /
 * reset-view button stack for custom map chrome (e.g. with `navigation="false"`
 * on the map). Place it NEXT TO the map inside a `relative isolate` wrapper;
 * it sits bottom-right above the map panes:
 *
 *   <div class="relative isolate">
 *     <uip-leaflet-map id="offices" navigation="false" …></uip-leaflet-map>
 *     <uip-leaflet-map-controls for="offices"></uip-leaflet-map-controls>
 *   </div>
 *
 * `for` is the map's id; without it the first <uip-leaflet-map> in the parent
 * is used. Each button fires a cancelable `zoom-in` / `zoom-out` / `reset`
 * event (React's onZoomIn/onZoomOut/onReset); unless prevented it acts on the
 * map — reset returns to the map's `center` / `zoom` (e.g. call `fitBounds` in
 * your `reset` handler and `preventDefault()` for reset-to-fit).
 *
 * Labels (aria-label + tooltip): `zoom-in-label`, `zoom-out-label`,
 * `reset-label`. Parts: `base`, `zoom-in`, `zoom-out`, `reset`.
 */
export class UipLeafletMapControls extends LitElement {
  // The absolute stack positions against the consumer's wrapper, not the host.
  static styles = [tailwind, css`:host { display: contents; }`]

  static properties = {
    for: {},
    zoomInLabel: { attribute: 'zoom-in-label' },
    zoomOutLabel: { attribute: 'zoom-out-label' },
    resetLabel: { attribute: 'reset-label' },
  }

  for?: string
  zoomInLabel = 'Zoom in'
  zoomOutLabel = 'Zoom out'
  resetLabel = 'Reset view'

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'leaflet-map-controls')
  }

  private get targetMap(): UipLeafletMap | null {
    const root = this.getRootNode() as Document | ShadowRoot
    if (this.for) return (root.getElementById?.(this.for) as UipLeafletMap | null) ?? null
    return this.parentElement?.querySelector('uip-leaflet-map') ?? null
  }

  private act(name: 'zoom-in' | 'zoom-out' | 'reset') {
    const ev = new CustomEvent(name, { bubbles: true, composed: true, cancelable: true })
    if (!this.dispatchEvent(ev)) return
    const map = this.targetMap
    if (!map) return
    if (name === 'zoom-in') map.zoomIn()
    else if (name === 'zoom-out') map.zoomOut()
    else map.flyTo({ center: map.center, zoom: map.zoom })
  }

  private button(name: 'zoom-in' | 'zoom-out' | 'reset', label: string, glyph: ReturnType<typeof icon>, first = false) {
    return html`<button
      type="button"
      part=${name}
      data-slot=${`leaflet-map-${name}`}
      class=${cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'size-8 rounded-none', !first && 'border-t')}
      aria-label=${label}
      title=${label}
      @click=${() => this.act(name)}
    >
      ${glyph}
    </button>`
  }

  render() {
    return html`<div
      part="base"
      data-slot="leaflet-map-controls"
      class="bg-card/90 absolute right-3 bottom-3 z-[800] flex flex-col overflow-hidden rounded-md border backdrop-blur-sm"
    >
      ${this.button('zoom-in', this.zoomInLabel, icon(Plus, 'plus', 'size-4'), true)}
      ${this.button('zoom-out', this.zoomOutLabel, icon(Minus, 'minus', 'size-4'))}
      ${this.button('reset', this.resetLabel, icon(RotateCcw, 'rotate-ccw', 'size-4'))}
    </div>`
  }
}

// ── <uip-leaflet-popup-card> ──────────────────────────────────────────────────

/**
 * <uip-leaflet-popup-card> — LeafletPopupCard: card-style content for the
 * inside of a <uip-leaflet-popup>: title row (category dot, heading, muted
 * subtitle, trailing badge), then its children — usually a
 * <uip-leaflet-popup-card-stats> strip and free content. It renders in its own
 * shadow root, so Leaflet's `.leaflet-popup-content p` margins can't reach it.
 *
 *   <uip-leaflet-popup lng-lat="[-0.0877, 51.5155]">
 *     <uip-leaflet-popup-card heading="London HQ" subtitle="United Kingdom" badge="Headquarters" badge-variant="info"
 *       dot class="[&::part(dot)]:bg-chart-1">
 *       <uip-leaflet-popup-card-stats>
 *         <uip-leaflet-popup-card-stat label="People" value="184" hint="+6%" hint-tone="success"></uip-leaflet-popup-card-stat>
 *         <uip-leaflet-popup-card-stat label="Roles" value="9" hint="Hiring"></uip-leaflet-popup-card-stat>
 *       </uip-leaflet-popup-card-stats>
 *       <div class="text-xs">John Doe · Site lead</div>
 *     </uip-leaflet-popup-card>
 *   </uip-leaflet-popup>
 *
 * Properties: `heading` (React's `title`; `title` is an HTMLElement
 * attribute), `subtitle`, `badge` (text) + `badge-variant` (the Badge
 * variants, default `secondary`), `dot` (category dot before the heading —
 * React's `dotClassName`; colour it with `[&::part(dot)]:bg-…`). Slots:
 * `subtitle` (rich subtitle, e.g. with an icon), `badge` (a custom badge),
 * default (children, stacked with `gap-3`). Parts: `base`, `dot`, `heading`,
 * `subtitle`, `badge`.
 */
export class UipLeafletPopupCard extends LitElement {
  static styles = [tailwind, css`:host { display: block; }`]

  static properties = {
    heading: {},
    subtitle: {},
    badge: {},
    badgeVariant: { attribute: 'badge-variant' },
    dot: { type: Boolean },
  }

  heading = ''
  subtitle?: string
  badge?: string
  badgeVariant: NonNullable<BadgeVariants['variant']> = 'secondary'
  dot = false

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'leaflet-popup-card')
  }

  render() {
    // Slotted children aren't shadow-tree children, so React's `space-y-3` is a flex gap here.
    return html`<div part="base" data-slot="leaflet-popup-card" class="text-popover-foreground flex w-60 flex-col gap-3 text-left">
      <!-- pr-5 keeps the title clear of Leaflet's close button. -->
      <div class="flex items-start justify-between gap-3 pr-5">
        <div class="min-w-0">
          <div class="flex items-center gap-1.5">
            ${this.dot
              ? html`<span part="dot" class="bg-primary size-2 shrink-0 rounded-full" aria-hidden="true"></span>`
              : nothing}
            <span part="heading" class="truncate text-sm font-semibold">${this.heading}</span>
          </div>
          <div part="subtitle" class="text-muted-foreground mt-0.5 flex min-w-0 items-center gap-1.5 text-xs">
            <slot name="subtitle"><span class="truncate">${this.subtitle ?? ''}</span></slot>
          </div>
        </div>
        <div class="shrink-0">
          <slot name="badge"
            >${this.badge
              ? html`<span part="badge" data-slot="badge" class=${badgeVariants({ variant: this.badgeVariant })}
                  >${this.badge}</span
                >`
              : nothing}</slot
          >
        </div>
      </div>
      <slot></slot>
    </div>`
  }
}

/**
 * <uip-leaflet-popup-card-stats> — LeafletPopupStats: bordered strip of
 * equal-width stat cells. Children: <uip-leaflet-popup-card-stat>s. React's
 * `divide-x` can't reach slotted cells, so the strip marks every cell after
 * the first as `divided` (it draws its own left border). Part: `base`.
 */
export class UipLeafletPopupCardStats extends LitElement {
  static styles = [tailwind, css`:host { display: block; }`]

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'leaflet-popup-stats')
  }

  private onSlotChange(e: Event) {
    const cells = (e.target as HTMLSlotElement).assignedElements()
    cells.forEach((el, i) => {
      if (el instanceof UipLeafletPopupCardStat) el.divided = i > 0
    })
  }

  render() {
    return html`<div
      part="base"
      data-slot="leaflet-popup-stats"
      class="bg-muted/50 grid auto-cols-fr grid-flow-col overflow-hidden rounded-md border"
    >
      <slot @slotchange=${this.onSlotChange}></slot>
    </div>`
  }
}

/**
 * <uip-leaflet-popup-card-stat> — LeafletPopupStat: one cell of a
 * <uip-leaflet-popup-card-stats> strip. Properties: `label`, `value`, `hint`
 * (small line under the value: "+4%", "Hiring", a timezone; or `slot="hint"`
 * for rich content), `hint-tone` (`muted` default | `success` — React's
 * `hintClassName`). Slot `icon`: a small icon before the label. Parts:
 * `base`, `label`, `value`, `hint`.
 */
export class UipLeafletPopupCardStat extends LitElement {
  static styles = [tailwind, css`:host { display: block; }`]

  static properties = {
    label: {},
    value: {},
    hint: {},
    hintTone: { attribute: 'hint-tone' },
    divided: { type: Boolean, attribute: false },
    hasHint: { state: true },
  }

  label = ''
  value = ''
  hint?: string
  hintTone: 'muted' | 'success' = 'muted'
  /** Set by the stats strip on every cell after the first. */
  divided = false
  private hasHint = false

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'leaflet-popup-stat')
  }

  private onHintSlotChange(e: Event) {
    this.hasHint = (e.target as HTMLSlotElement)
      .assignedNodes()
      .some((n) => n.nodeType === 1 || n.textContent?.trim())
  }

  render() {
    const showHint = this.hasHint || !!this.hint
    return html`<div part="base" data-slot="leaflet-popup-stat" class=${cn('h-full min-w-0 px-2 py-1.5', this.divided && 'border-l')}>
      <div part="label" class="text-muted-foreground flex items-center gap-1 text-xs">
        <slot name="icon" class="[&::slotted(svg)]:size-3.5 [&::slotted(svg)]:shrink-0"></slot>
        <span class="truncate">${this.label}</span>
      </div>
      <div part="value" class="mt-0.5 text-sm font-semibold tabular-nums">${this.value}</div>
      <div
        part="hint"
        class=${cn('text-xs tabular-nums', this.hintTone === 'success' ? 'text-success' : 'text-muted-foreground')}
        ?hidden=${!showHint}
      >
        <slot name="hint" @slotchange=${this.onHintSlotChange}>${this.hint ?? ''}</slot>
      </div>
    </div>`
  }
}

customElements.get('uip-leaflet-map') || customElements.define('uip-leaflet-map', UipLeafletMap)
customElements.get('uip-leaflet-marker') || customElements.define('uip-leaflet-marker', UipLeafletMarker)
customElements.get('uip-leaflet-popup') || customElements.define('uip-leaflet-popup', UipLeafletPopup)
customElements.get('uip-leaflet-tooltip') || customElements.define('uip-leaflet-tooltip', UipLeafletTooltip)
customElements.get('uip-leaflet-polyline') || customElements.define('uip-leaflet-polyline', UipLeafletPolyline)
customElements.get('uip-leaflet-polygon') || customElements.define('uip-leaflet-polygon', UipLeafletPolygon)
customElements.get('uip-leaflet-circle') || customElements.define('uip-leaflet-circle', UipLeafletCircle)
customElements.get('uip-leaflet-circle-marker') ||
  customElements.define('uip-leaflet-circle-marker', UipLeafletCircleMarker)
customElements.get('uip-leaflet-geo-json') || customElements.define('uip-leaflet-geo-json', UipLeafletGeoJson)
customElements.get('uip-leaflet-tile-layer') || customElements.define('uip-leaflet-tile-layer', UipLeafletTileLayer)
customElements.get('uip-leaflet-map-controls') ||
  customElements.define('uip-leaflet-map-controls', UipLeafletMapControls)
customElements.get('uip-leaflet-popup-card') || customElements.define('uip-leaflet-popup-card', UipLeafletPopupCard)
customElements.get('uip-leaflet-popup-card-stats') ||
  customElements.define('uip-leaflet-popup-card-stats', UipLeafletPopupCardStats)
customElements.get('uip-leaflet-popup-card-stat') ||
  customElements.define('uip-leaflet-popup-card-stat', UipLeafletPopupCardStat)

declare global {
  interface HTMLElementTagNameMap {
    'uip-leaflet-map': UipLeafletMap
    'uip-leaflet-marker': UipLeafletMarker
    'uip-leaflet-popup': UipLeafletPopup
    'uip-leaflet-tooltip': UipLeafletTooltip
    'uip-leaflet-polyline': UipLeafletPolyline
    'uip-leaflet-polygon': UipLeafletPolygon
    'uip-leaflet-circle': UipLeafletCircle
    'uip-leaflet-circle-marker': UipLeafletCircleMarker
    'uip-leaflet-geo-json': UipLeafletGeoJson
    'uip-leaflet-tile-layer': UipLeafletTileLayer
    'uip-leaflet-map-controls': UipLeafletMapControls
    'uip-leaflet-popup-card': UipLeafletPopupCard
    'uip-leaflet-popup-card-stats': UipLeafletPopupCardStats
    'uip-leaflet-popup-card-stat': UipLeafletPopupCardStat
  }
}
