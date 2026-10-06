import { LitElement, css, html, isServer, unsafeCSS, type PropertyValues } from 'lit'
import type mapboxgl from 'mapbox-gl'
import mapboxCss from 'mapbox-gl/dist/mapbox-gl.css?inline'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import mapCss from './map.css?inline'
import { mapVariants, MAPBOX_STYLES, type MapVariant, type MapVariants } from './map.variants'

type Mapbox = typeof mapboxgl
type Corner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
type LngLat = [number, number]

/** `true` unless the attribute is absent or the string "false" — so defaults
 *  of `true` (navigation, show-zoom, close-button…) can be turned off in HTML. */
const boolAttr = { fromAttribute: (v: string | null) => v !== null && v !== 'false', toAttribute: (v: boolean) => (v ? '' : null) }
/** Tri-state: absent → undefined (React's "auto"), "false" → false, else true. */
const optionalBool = { fromAttribute: (v: string | null) => (v === null ? undefined : v !== 'false') }
/** JSON when it looks like JSON (`[0, 12]`, `{…}`), otherwise a number. */
const numberOrJson = { fromAttribute: (v: string | null) => (v === null ? undefined : /^\s*[[{]/.test(v) ? JSON.parse(v) : Number(v)) }

const isDarkPage = () => !isServer && document.documentElement.classList.contains('dark')

// ── Basemap helpers (verbatim from React's map.tsx) ───────────────────────────

/** Desaturate the basemap to a quiet canvas. Each op is guarded — style layer
 *  ids drift between style versions and the wrong property for a layer type
 *  throws. */
function applyMuted(map: mapboxgl.Map, dark: boolean) {
  let styleLayers: any[]
  try {
    styleLayers = map.getStyle()?.layers ?? []
  } catch {
    return // style not loaded yet
  }
  const P = dark
    ? {
        land: 'rgb(23,24,29)',
        water: 'rgb(17,18,22)',
        use: 'rgb(31,32,38)',
        road: 'rgb(50,52,60)',
        label: 'rgb(150,152,165)',
        halo: 'rgb(23,24,29)',
        admin: 'rgb(50,52,60)',
      }
    : {
        land: 'rgb(246,247,249)',
        water: 'rgb(226,230,235)',
        use: 'rgb(238,240,243)',
        road: 'rgb(221,224,229)',
        label: 'rgb(120,124,134)',
        halo: 'rgb(246,247,249)',
        admin: 'rgb(213,216,221)',
      }
  for (const l of styleLayers) {
    const id = l.id
    try {
      if (id === 'background' || id === 'land') map.setPaintProperty(id, 'background-color', P.land)
      else if (/water/.test(id) && l.type === 'fill') map.setPaintProperty(id, 'fill-color', P.water)
      else if (/landuse|landcover|national-park/.test(id) && l.type === 'fill')
        map.setPaintProperty(id, 'fill-color', P.use)
      else if (/^road-(motorway|trunk|primary)/.test(id) && l.type === 'line') {
        map.setPaintProperty(id, 'line-color', P.road)
        map.setPaintProperty(id, 'line-opacity', 0.55)
      } else if (/^road-(secondary|tertiary|street|minor|service|path|pedestrian)/.test(id)) {
        map.setLayoutProperty(id, 'visibility', 'none')
      } else if (/poi|transit|airport|natural-point|water-point|waterway-label|building/.test(id)) {
        map.setLayoutProperty(id, 'visibility', 'none')
      } else if (
        /road-label|settlement-major-label|settlement-minor-label|state-label/.test(id) &&
        l.type === 'symbol'
      ) {
        map.setPaintProperty(id, 'text-color', P.label)
        map.setPaintProperty(id, 'text-halo-color', P.halo)
        map.setPaintProperty(id, 'text-opacity', 0.6)
      } else if (id === 'admin-1-boundary' && l.type === 'line') {
        map.setPaintProperty(id, 'line-color', P.admin)
        map.setPaintProperty(id, 'line-opacity', 0.6)
      } else if (id === 'admin-1-boundary-bg') map.setPaintProperty(id, 'line-opacity', 0)
    } catch {
      /* skip */
    }
  }
}

function apply3DBuildings(map: mapboxgl.Map, dark: boolean) {
  if (map.getLayer('3d-buildings')) return
  const layers = map.getStyle()?.layers
  let labelLayerId: string | undefined
  if (layers) {
    for (let i = 0; i < layers.length; i++) {
      if (layers[i].type === 'symbol' && (layers[i].layout as any)?.['text-field']) {
        labelLayerId = layers[i].id
        break
      }
    }
  }
  try {
    map.addLayer(
      {
        id: '3d-buildings',
        source: 'composite',
        'source-layer': 'building',
        filter: ['==', 'extrude', 'true'],
        type: 'fill-extrusion',
        minzoom: 14,
        paint: {
          'fill-extrusion-color': dark ? '#27272a' : '#d4d4d8',
          'fill-extrusion-height': ['interpolate', ['linear'], ['zoom'], 14, 0, 14.05, ['get', 'height']],
          'fill-extrusion-base': ['interpolate', ['linear'], ['zoom'], 14, 0, 14.05, ['get', 'min_height']],
          'fill-extrusion-opacity': 0.8,
        },
      },
      labelLayerId,
    )
  } catch {
    /* building layer not present in raster styles */
  }
}

function apply3DTerrain(map: mapboxgl.Map) {
  try {
    if (!map.getSource('mapbox-dem')) {
      map.addSource('mapbox-dem', {
        type: 'raster-dem',
        url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
        tileSize: 512,
        maxzoom: 14,
      })
    }
    map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 })
  } catch {
    /* terrain not supported in current projection */
  }
}

/** Resolve `lng-lat` or `longitude` + `latitude` (React accepts both). */
function coordsOf(el: { lngLat?: LngLat; longitude?: number; latitude?: number }): LngLat | undefined {
  if (el.lngLat) return el.lngLat
  if (el.longitude != null && el.latitude != null) return [el.longitude, el.latitude]
  return undefined
}

/** Children notify their map when their properties change. */
function notifyMap(el: HTMLElement) {
  el.closest<UipMap>('uip-map')?.requestSync()
}

// ── <uip-map> ─────────────────────────────────────────────────────────────────

/**
 * <uip-map> — the registry Map (Mapbox GL) as a web component.
 *
 * Classes, props and behaviour are React's `Map`: `mapVariants` on the wrapper,
 * theme-aware light/dark basemap, muted canvas, 3D buildings/terrain, nav +
 * fullscreen controls, and the "Mapbox token required" fallback when there is
 * no `access-token`. mapbox-gl is imported lazily (only with a token, once the
 * element is near the viewport), disposed on disconnect, and resized by a
 * ResizeObserver. Mapbox's CSS and React's map.css are adopted into the shadow
 * root, because Mapbox renders its canvas, controls and popups there.
 *
 * Children (the web-component stand-in for React's JSX children):
 *  - `<uip-map-marker>` / `<uip-map-popup>` — their light-DOM content is slotted
 *    into the Mapbox marker/popup, so it stays page-styled and framework-owned.
 *  - `<uip-map-source>` / `<uip-map-layer>` — declarative GeoJSON/vector data.
 *
 * `center` / `zoom` are the initial view (React's `initialViewState`); `pitch`,
 * `bearing`, style, projection and controls are applied live.
 *
 * Events: `created` (detail: { map }) once the style has loaded — React's
 * `onCreated`. The raw instance is also on the `map` property.
 */
export class UipMap extends LitElement {
  // Manual slot assignment: each marker/popup child is assigned to a <slot>
  // created inside its Mapbox container; sources/layers are never rendered.
  static shadowRootOptions = { ...LitElement.shadowRootOptions, slotAssignment: 'manual' as const }
  // Mapbox's own DOM (canvas, controls, popups, markers) lives in this shadow
  // root and can only be styled by its vendor CSS + React's map.css overrides.
  static styles = [tailwind, unsafeCSS(mapboxCss), unsafeCSS(mapCss), css`:host { display: grid; }`]

  static properties = {
    accessToken: { attribute: 'access-token' },
    variant: { reflect: true },
    size: { reflect: true },
    mapStyle: { attribute: 'map-style' },
    center: { type: Array },
    zoom: { type: Number },
    pitch: { type: Number },
    bearing: { type: Number },
    buildings3d: { type: Boolean },
    terrain3d: { type: Boolean },
    projection: {},
    navigation: { converter: boolAttr },
    navigationPosition: { attribute: 'navigation-position' },
    showCompass: { attribute: 'show-compass', converter: optionalBool },
    showZoom: { attribute: 'show-zoom', converter: boolAttr },
    fullscreen: { type: Boolean },
    fullscreenPosition: { attribute: 'fullscreen-position' },
    muted: { type: Boolean },
    dark: { state: true },
  }

  /** Mapbox access token. Empty/absent renders the "token required" fallback. */
  accessToken?: string
  variant: MapVariant = 'default'
  /** Height preset. Omit to size the host with classes (e.g. `size-full`). */
  size?: MapVariants['size']
  /** Custom style URL; overrides `variant` and the theme-aware default. */
  mapStyle?: string
  center: LngLat = [0, 20]
  zoom = 1.4
  pitch = 0
  bearing = 0
  buildings3d = false
  terrain3d = false
  projection = 'mercator'
  navigation = true
  navigationPosition: Corner = 'bottom-right'
  /** Defaults to `pitch > 0` when unset. */
  showCompass?: boolean
  showZoom = true
  fullscreen = false
  fullscreenPosition: Corner = 'top-right'
  muted = false
  private dark = false

  private lib?: Mapbox
  private instance?: mapboxgl.Map
  private loaded = false
  private initializing = false
  private inView = false
  private io?: IntersectionObserver
  private ro?: ResizeObserver
  private themeObserver?: MutationObserver
  private childObserver?: MutationObserver
  private navCtrl?: mapboxgl.NavigationControl
  private fsCtrl?: mapboxgl.FullscreenControl
  private markers = new Map<UipMapMarker, { marker: mapboxgl.Marker; key: string }>()
  private popups = new Map<UipMapPopup, { popup: mapboxgl.Popup; key: string }>()
  private layerSpecs = new Map<Element, { id: string; key: string }>()
  private sourceSpecs = new Map<Element, { id: string; key: string; data?: unknown }>()
  private syncQueued = false
  private appliedStyle?: string

  constructor() {
    super()
    new ThemeController(this)
  }

  /** The raw mapbox-gl Map once created (React's `ref.getMap()`). */
  get map(): mapboxgl.Map | undefined {
    return this.instance
  }

  private get isMuted() {
    return this.muted || this.variant === 'muted'
  }

  private get resolvedStyle() {
    if (this.mapStyle) return this.mapStyle
    if (this.variant && this.variant !== 'default' && this.variant !== 'muted' && MAPBOX_STYLES[this.variant as keyof typeof MAPBOX_STYLES]) {
      return MAPBOX_STYLES[this.variant as keyof typeof MAPBOX_STYLES]
    }
    return this.dark ? 'mapbox://styles/mapbox/dark-v11' : 'mapbox://styles/mapbox/light-v11'
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'map')
    const root = document.documentElement
    this.dark = isDarkPage()
    this.themeObserver = new MutationObserver(() => (this.dark = isDarkPage()))
    this.themeObserver.observe(root, { attributes: true, attributeFilter: ['class'] })
    // Additions/removals of marker/popup/source/layer children.
    this.childObserver = new MutationObserver(() => this.requestSync())
    this.childObserver.observe(this, { childList: true, subtree: true })
    if (this.hasUpdated) this.observeViewport()
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.themeObserver?.disconnect()
    this.childObserver?.disconnect()
    this.io?.disconnect()
    this.ro?.disconnect()
    this.destroy()
  }

  willUpdate() {
    this.setAttribute('data-variant', this.variant)
    this.setAttribute('data-muted', String(this.isMuted))
  }

  protected firstUpdated() {
    this.observeViewport()
  }

  // Latch like React: the observer only defers the first paint; leaving the
  // viewport never tears the WebGL map down.
  private observeViewport() {
    if (this.inView) return void this.init()
    if (typeof IntersectionObserver === 'undefined') {
      this.inView = true
      return void this.init()
    }
    this.io?.disconnect()
    this.io = new IntersectionObserver(
      ([entry]) => {
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
    if (!this.accessToken || !this.inView || this.instance || this.initializing || !this.isConnected) return
    this.initializing = true
    try {
      const lib = (this.lib ??= (await import('mapbox-gl')).default)
      await this.updateComplete
      const container = this.renderRoot.querySelector<HTMLElement>('[data-map-container]')
      if (!container || !this.isConnected || !this.accessToken) return
      const map = new lib.Map({
        container,
        accessToken: this.accessToken,
        style: (this.appliedStyle = this.resolvedStyle),
        center: this.center,
        zoom: this.zoom,
        pitch: this.pitch,
        bearing: this.bearing,
        attributionControl: false,
      })
      this.instance = map
      map.on('load', () => this.onLoad(map))
      map.on('styledata', () => this.onStyleData(map))
      // setStyle() drops every source/layer: re-add the declarative ones.
      map.on('style.load', () => {
        if (!this.loaded) return
        this.sourceSpecs.clear()
        this.layerSpecs.clear()
        this.syncChildren()
      })
      this.ro = new ResizeObserver(() => this.instance?.resize())
      this.ro.observe(this)
      this.applyControls()
    } finally {
      this.initializing = false
    }
  }

  private onLoad(map: mapboxgl.Map) {
    this.loaded = true
    // The container may have settled its size after construction.
    map.resize()
    try {
      map.setProjection(this.projection as any)
    } catch {
      /* older api */
    }
    if (this.pitch) {
      try {
        map.setPitch(this.pitch)
      } catch {
        /* ignore */
      }
    }
    if (this.bearing) {
      try {
        map.setBearing(this.bearing)
      } catch {
        /* ignore */
      }
    }
    if (this.isMuted) applyMuted(map, this.dark)
    if (this.buildings3d) apply3DBuildings(map, this.dark)
    if (this.terrain3d) apply3DTerrain(map)
    this.syncChildren()
    this.dispatchEvent(new CustomEvent('created', { detail: { map }, bubbles: true, composed: true }))
  }

  private onStyleData(map: mapboxgl.Map) {
    if (this.isMuted) applyMuted(map, this.dark)
    if (this.buildings3d) apply3DBuildings(map, this.dark)
    if (this.terrain3d) apply3DTerrain(map)
  }

  private destroy() {
    for (const { marker } of this.markers.values()) marker.remove()
    for (const { popup } of this.popups.values()) popup.remove()
    this.markers.clear()
    this.popups.clear()
    this.sourceSpecs.clear()
    this.layerSpecs.clear()
    this.navCtrl = this.fsCtrl = undefined
    this.instance?.remove()
    this.instance = undefined
    this.loaded = false
  }

  private applyControls() {
    const map = this.instance
    const lib = this.lib
    if (!map || !lib) return
    if (this.navCtrl) map.removeControl(this.navCtrl)
    if (this.fsCtrl) map.removeControl(this.fsCtrl)
    this.navCtrl = this.fsCtrl = undefined
    if (this.navigation) {
      this.navCtrl = new lib.NavigationControl({
        showCompass: this.showCompass !== undefined ? this.showCompass : (this.pitch ?? 0) > 0,
        showZoom: this.showZoom,
      })
      map.addControl(this.navCtrl, this.navigationPosition)
    }
    if (this.fullscreen) {
      this.fsCtrl = new lib.FullscreenControl()
      map.addControl(this.fsCtrl, this.fullscreenPosition)
    }
  }

  protected updated(changed: PropertyValues) {
    if (changed.has('accessToken') && this.hasUpdated) {
      this.destroy()
      this.init()
    }
    const map = this.instance
    if (!map) return
    // Only reload when the resolved URL changed (the theme only matters for the default style).
    const nextStyle = this.resolvedStyle
    if (nextStyle !== this.appliedStyle) {
      this.appliedStyle = nextStyle
      map.setStyle(nextStyle)
    }
    if (!this.loaded) return
    if (changed.has('pitch')) {
      try {
        map.setPitch(this.pitch)
      } catch {
        /* ignore */
      }
    }
    if (changed.has('bearing')) {
      try {
        map.setBearing(this.bearing)
      } catch {
        /* ignore */
      }
    }
    if (changed.has('projection')) {
      try {
        map.setProjection(this.projection as any)
      } catch {
        /* ignore */
      }
    }
    if ((changed.has('muted') || changed.has('dark')) && this.isMuted) applyMuted(map, this.dark)
    if (changed.has('buildings3d') && this.buildings3d) apply3DBuildings(map, this.dark)
    if (changed.has('terrain3d') && this.terrain3d) apply3DTerrain(map)
    if (
      ['navigation', 'navigationPosition', 'showCompass', 'showZoom', 'fullscreen', 'fullscreenPosition'].some((k) =>
        changed.has(k),
      ) ||
      (changed.has('pitch') && this.showCompass === undefined)
    ) {
      this.applyControls()
    }
  }

  /** Batched: re-reconcile children with the Mapbox instance. */
  requestSync() {
    if (this.syncQueued) return
    this.syncQueued = true
    queueMicrotask(() => {
      this.syncQueued = false
      this.syncChildren()
    })
  }

  /** A <slot> inside a Mapbox-owned container, manually assigned to `el`. */
  private slotFor(el: HTMLElement) {
    const holder = document.createElement('div')
    const slot = document.createElement('slot')
    holder.append(slot)
    slot.assign(el)
    return holder
  }

  private syncChildren() {
    const map = this.instance
    const lib = this.lib
    if (!map || !lib || !this.loaded) return
    const kids = [...this.children]

    // Markers.
    const markerEls = kids.filter((k): k is UipMapMarker => k instanceof UipMapMarker)
    for (const [el, entry] of this.markers) {
      if (!markerEls.includes(el)) {
        entry.marker.remove()
        this.markers.delete(el)
      }
    }
    for (const el of markerEls) {
      const lngLat = coordsOf(el)
      if (!lngLat) continue
      const hasContent = el.childNodes.length > 0
      const key = JSON.stringify([el.anchor, hasContent, el.color, el.pitchAlignment, el.rotationAlignment])
      let entry = this.markers.get(el)
      if (entry && entry.key !== key) {
        entry.marker.remove()
        entry = undefined
      }
      if (!entry) {
        const holder = hasContent ? this.slotFor(el) : undefined
        const marker = new lib.Marker({
          element: holder,
          anchor: el.anchor,
          color: el.color,
          pitchAlignment: el.pitchAlignment,
          rotationAlignment: el.rotationAlignment,
        })
        marker.setLngLat(lngLat).addTo(map)
        entry = { marker, key }
        this.markers.set(el, entry)
      }
      entry.marker.setLngLat(lngLat)
      entry.marker.setOffset(el.offset ?? [0, 0])
      entry.marker.setRotation(el.rotation ?? 0)
    }

    // Popups: present = open (React renders <MapPopup> conditionally).
    const popupEls = kids.filter((k): k is UipMapPopup => k instanceof UipMapPopup)
    for (const [el, entry] of this.popups) {
      if (!popupEls.includes(el)) {
        entry.popup.off('close', (entry.popup as any).__uipClose)
        entry.popup.remove()
        this.popups.delete(el)
      }
    }
    for (const el of popupEls) {
      const lngLat = coordsOf(el)
      if (!lngLat) continue
      const key = JSON.stringify([el.anchor, el.closeButton, el.closeOnClick])
      let entry = this.popups.get(el)
      if (entry && entry.key !== key) {
        entry.popup.off('close', (entry.popup as any).__uipClose)
        entry.popup.remove()
        entry = undefined
      }
      if (!entry) {
        const popup = new lib.Popup({
          anchor: el.anchor,
          offset: el.offset,
          closeButton: el.closeButton,
          closeOnClick: el.closeOnClick,
          maxWidth: el.maxWidth,
        })
        const onClose = () => el.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }))
        ;(popup as any).__uipClose = onClose
        popup.on('close', onClose)
        popup.setLngLat(lngLat).setDOMContent(this.slotFor(el)).addTo(map)
        entry = { popup, key }
        this.popups.set(el, entry)
      } else if (entry.popup.isOpen()) {
        entry.popup.setLngLat(lngLat)
        if (el.offset !== undefined) entry.popup.setOffset(el.offset)
        if (el.maxWidth) entry.popup.setMaxWidth(el.maxWidth)
      }
    }

    // Sources, then layers (a layer inside a source defaults to that source).
    const sourceEls = kids.filter((k): k is UipMapSource => k instanceof UipMapSource)
    const layerEls = [
      ...sourceEls.flatMap((s) => [...s.children].filter((c): c is UipMapLayer => c instanceof UipMapLayer)),
      ...kids.filter((k): k is UipMapLayer => k instanceof UipMapLayer),
    ]
    for (const [el, spec] of this.layerSpecs) {
      if (!layerEls.includes(el as UipMapLayer)) {
        if (map.getLayer(spec.id)) map.removeLayer(spec.id)
        this.layerSpecs.delete(el)
      }
    }
    for (const [el, spec] of this.sourceSpecs) {
      if (!sourceEls.includes(el as UipMapSource)) {
        if (map.getSource(spec.id)) map.removeSource(spec.id)
        this.sourceSpecs.delete(el)
      }
    }
    for (const el of sourceEls) {
      if (!el.id) continue
      const spec = el.spec()
      const { data, ...rest } = spec as { data?: unknown }
      const key = JSON.stringify([el.id, rest])
      const prev = this.sourceSpecs.get(el)
      if (prev && prev.key === key) {
        if (prev.data !== data && data !== undefined) {
          ;(map.getSource(el.id) as mapboxgl.GeoJSONSource | undefined)?.setData?.(data as any)
          prev.data = data
        }
        continue
      }
      if (prev) {
        // Spec changed: drop its layers first, they're re-added below.
        for (const [lel, lspec] of this.layerSpecs) {
          if (map.getLayer(lspec.id) && (map.getLayer(lspec.id) as any).source === prev.id) {
            map.removeLayer(lspec.id)
            this.layerSpecs.delete(lel)
          }
        }
        if (map.getSource(prev.id)) map.removeSource(prev.id)
      }
      if (!map.getSource(el.id)) map.addSource(el.id, spec as any)
      this.sourceSpecs.set(el, { id: el.id, key, data })
    }
    for (const el of layerEls) {
      if (!el.id) continue
      const parent = el.parentElement instanceof UipMapSource ? el.parentElement.id : undefined
      const spec = el.spec(parent)
      const key = JSON.stringify([spec, el.beforeId])
      const prev = this.layerSpecs.get(el)
      if (prev && prev.key === key && map.getLayer(prev.id)) continue
      if (prev && map.getLayer(prev.id)) map.removeLayer(prev.id)
      if (spec.source && typeof spec.source === 'string' && !map.getSource(spec.source)) continue
      map.addLayer(spec as any, el.beforeId && map.getLayer(el.beforeId) ? el.beforeId : undefined)
      this.layerSpecs.set(el, { id: el.id, key })
    }
  }

  render() {
    const token = this.accessToken
    return html`<div
      part="base"
      data-variant=${this.variant}
      data-muted=${String(this.isMuted)}
      class=${cn(mapVariants({ variant: this.variant, ...(this.size ? { size: this.size } : {}) }), 'rounded-[inherit]')}
    >
      ${token
        ? html`<div data-map-container class="relative size-full"></div>`
        : html`<div class="text-muted-foreground flex size-full flex-col items-center justify-center gap-1 px-6 text-center text-sm">
            <span class="text-foreground font-medium">Mapbox token required</span>
            <span>Pass an access token to render the map.</span>
          </div>`}
    </div>`
  }
}

// ── <uip-map-marker> ──────────────────────────────────────────────────────────

/**
 * <uip-map-marker> — React's `MapMarker`. Place inside `<uip-map>`; its content
 * is the marker (no content = Mapbox's default pin, tinted by `color`).
 * Position with `lng-lat="[lng, lat]"` or `longitude` + `latitude`.
 * Clicks bubble from the element itself (React's `onClick`).
 */
export class UipMapMarker extends LitElement {
  static styles = [tailwind, css`:host { display: block; }`]

  static properties = {
    lngLat: { attribute: 'lng-lat', type: Array },
    longitude: { type: Number },
    latitude: { type: Number },
    anchor: {},
    offset: { converter: numberOrJson },
    rotation: { type: Number },
    color: {},
    pitchAlignment: { attribute: 'pitch-alignment' },
    rotationAlignment: { attribute: 'rotation-alignment' },
  }

  lngLat?: LngLat
  longitude?: number
  latitude?: number
  anchor?: mapboxgl.Anchor
  offset?: [number, number]
  rotation?: number
  color?: string
  pitchAlignment?: 'map' | 'viewport' | 'auto'
  rotationAlignment?: 'map' | 'viewport' | 'auto' | 'horizon'

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-slot', 'map-marker')
  }

  protected updated() {
    notifyMap(this)
  }

  render() {
    return html`<slot></slot>`
  }
}

// ── <uip-map-popup> ───────────────────────────────────────────────────────────

/**
 * <uip-map-popup> — React's `MapPopup`. Present = open (React renders it
 * conditionally); remove the element to close it.
 * Events: `close` when the user closes it (close button / map click) — React's `onClose`.
 */
export class UipMapPopup extends LitElement {
  static styles = [tailwind, css`:host { display: block; }`]

  static properties = {
    lngLat: { attribute: 'lng-lat', type: Array },
    longitude: { type: Number },
    latitude: { type: Number },
    anchor: {},
    offset: { converter: numberOrJson },
    closeButton: { attribute: 'close-button', converter: boolAttr },
    closeOnClick: { attribute: 'close-on-click', converter: boolAttr },
    maxWidth: { attribute: 'max-width' },
  }

  lngLat?: LngLat
  longitude?: number
  latitude?: number
  anchor?: mapboxgl.Anchor
  offset?: number | [number, number]
  closeButton = true
  closeOnClick = true
  maxWidth?: string

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-slot', 'map-popup')
  }

  protected updated() {
    notifyMap(this)
  }

  render() {
    return html`<slot></slot>`
  }
}

// ── <uip-map-source> / <uip-map-layer> ────────────────────────────────────────

/**
 * <uip-map-source> — React's `MapSource`. The element's `id` is the source id.
 * Spec: `type` + `data` (property or JSON attribute), or a full `options` object
 * (React's Vue-parity `options` prop). Changing `data` on a GeoJSON source calls
 * `setData`. Put `<uip-map-layer>`s inside to draw it. Never rendered.
 */
export class UipMapSource extends LitElement {
  static styles = [css`:host { display: none; }`]

  static properties = {
    type: {},
    data: { type: Object },
    url: {},
    options: { type: Object },
  }

  type?: string
  data?: unknown
  url?: string
  options?: Record<string, unknown>

  spec(): Record<string, unknown> {
    const s: Record<string, unknown> = { ...(this.options ?? {}) }
    if (this.type) s.type = this.type
    if (this.data !== undefined) s.data = this.data
    if (this.url) s.url = this.url
    return s
  }

  protected updated() {
    notifyMap(this)
  }

  render() {
    return html``
  }
}

/**
 * <uip-map-layer> — React's `MapLayer`. The element's `id` is the layer id;
 * `source` defaults to the wrapping `<uip-map-source>`. Spec from `type`,
 * `layout`, `paint`, `filter`, `source-layer`, `minzoom`, `maxzoom`, or a full
 * `options` object. `before-id` inserts it under an existing layer. Never rendered.
 */
export class UipMapLayer extends LitElement {
  static styles = [css`:host { display: none; }`]

  static properties = {
    type: {},
    source: {},
    sourceLayer: { attribute: 'source-layer' },
    layout: { type: Object },
    paint: { type: Object },
    filter: { type: Array },
    minzoom: { type: Number },
    maxzoom: { type: Number },
    beforeId: { attribute: 'before-id' },
    options: { type: Object },
  }

  type?: string
  source?: string
  sourceLayer?: string
  layout?: Record<string, unknown>
  paint?: Record<string, unknown>
  filter?: unknown[]
  minzoom?: number
  maxzoom?: number
  beforeId?: string
  options?: Record<string, unknown>

  spec(parentSource?: string): Record<string, unknown> {
    const s: Record<string, unknown> = { ...(this.options ?? {}), id: this.id }
    const source = this.source ?? parentSource
    if (source) s.source = source
    if (this.type) s.type = this.type
    if (this.sourceLayer) s['source-layer'] = this.sourceLayer
    if (this.layout) s.layout = this.layout
    if (this.paint) s.paint = this.paint
    if (this.filter) s.filter = this.filter
    if (this.minzoom !== undefined) s.minzoom = this.minzoom
    if (this.maxzoom !== undefined) s.maxzoom = this.maxzoom
    return s
  }

  protected updated() {
    notifyMap(this)
  }

  render() {
    return html``
  }
}

customElements.get('uip-map') || customElements.define('uip-map', UipMap)
customElements.get('uip-map-marker') || customElements.define('uip-map-marker', UipMapMarker)
customElements.get('uip-map-popup') || customElements.define('uip-map-popup', UipMapPopup)
customElements.get('uip-map-source') || customElements.define('uip-map-source', UipMapSource)
customElements.get('uip-map-layer') || customElements.define('uip-map-layer', UipMapLayer)

declare global {
  interface HTMLElementTagNameMap {
    'uip-map': UipMap
    'uip-map-marker': UipMapMarker
    'uip-map-popup': UipMapPopup
    'uip-map-source': UipMapSource
    'uip-map-layer': UipMapLayer
  }
}
