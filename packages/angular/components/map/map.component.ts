import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
  ChangeDetectionStrategy,
  DOCUMENT,
  inject,
} from '@angular/core'
import type * as mapboxgl from 'mapbox-gl'
import { cn } from '@/lib/utils'
import { mapVariants, MAPBOX_STYLES, type MapVariant, type MapVariants } from './map.variants'

export type MapSize = NonNullable<MapVariants['size']>
export type MapNavigationPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

export interface MapSourceInput {
  id: string
  type?: string
  data?: unknown
  options?: mapboxgl.AnySourceData
}

export interface MapLayerInput {
  id: string
  type?: string
  source?: string
  paint?: Record<string, unknown>
  layout?: Record<string, unknown>
  beforeId?: string
  options?: Partial<mapboxgl.AnyLayer>
}

/** The design-system Mapbox chrome — `map.css` beside this file, verbatim (a spec keeps them in sync). */
export const MAP_CSS = `
.mapboxgl-ctrl-group {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow-sm, 0 1px 2px rgb(0 0 0 / 0.08));
}
.mapboxgl-ctrl-group button {
  background: transparent;
}
.mapboxgl-ctrl-group button + button {
  border-top-color: var(--border);
}
.mapboxgl-ctrl-group button .mapboxgl-ctrl-icon {
  filter: invert(var(--map-ctrl-invert, 0)) opacity(0.7);
}
.dark .mapboxgl-ctrl-group {
  background: var(--card, #18181b);
  border-color: var(--border, #27272a);
}
.dark .mapboxgl-ctrl-group button {
  background: transparent;
}
.dark .mapboxgl-ctrl-group button:hover {
  background: var(--muted, #27272a);
}
.dark .mapboxgl-ctrl-group button + button {
  border-top-color: var(--border, #27272a);
}
.dark .mapboxgl-ctrl-group button .mapboxgl-ctrl-icon {
  filter: invert(1) brightness(1.2);
}
.mapboxgl-ctrl-attrib {
  background: color-mix(in oklab, var(--card) 80%, transparent);
  color: var(--muted-foreground);
}
.mapboxgl-ctrl-attrib a {
  color: var(--muted-foreground);
}
.mapboxgl-popup-content {
  padding: 8px 12px;
  background: var(--popover);
  color: var(--popover-foreground);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow-md, 0 4px 12px rgb(0 0 0 / 0.12));
}
.mapboxgl-popup-close-button {
  color: var(--muted-foreground);
}
.mapboxgl-popup-tip {
  border-top-color: var(--popover);
  border-bottom-color: var(--popover);
}
`

/**
 * Puts `MAP_CSS` into `<head>` once. It is global on purpose: Mapbox renders its
 * controls and popups outside the component's view, so encapsulated styles can't reach them.
 */
export function ensureMapCss(doc: Document): void {
  if (doc.head.querySelector('style[data-uipkge-map]')) return
  const style = doc.createElement('style')
  style.setAttribute('data-uipkge-map', '')
  style.textContent = MAP_CSS
  doc.head.appendChild(style)
}

/**
 * Loads Mapbox GL's own stylesheet (what React/Vue get from `import 'mapbox-gl/dist/mapbox-gl.css'`)
 * unless the page already has it. Without it markers are `position: static` and stack below the canvas.
 *
 * Detection is by effect, not by URL: a probe `.mapboxgl-marker` that computes to `position: absolute`
 * means the stylesheet is present (e.g. listed in angular.json `styles`), so nothing is added.
 * Otherwise a `<link>` to Mapbox's CDN copy for the exact installed version is appended once.
 */
export function ensureMapboxCss(doc: Document, version: string | undefined): void {
  if (!version || doc.head.querySelector('link[data-uipkge-mapbox]')) return
  const probe = doc.createElement('div')
  probe.className = 'mapboxgl-marker'
  doc.body.appendChild(probe)
  const present = doc.defaultView?.getComputedStyle(probe).position === 'absolute'
  probe.remove()
  if (present) return
  const link = doc.createElement('link')
  link.rel = 'stylesheet'
  link.href = `https://api.mapbox.com/mapbox-gl-js/v${version}/mapbox-gl.css`
  link.setAttribute('data-uipkge-mapbox', '')
  doc.head.appendChild(link)
}

type MapboxModule = typeof import('mapbox-gl')

async function loadMapbox(doc: Document): Promise<MapboxModule['default']> {
  const mod = await import('mapbox-gl')
  const mapbox = (mod.default ?? mod) as MapboxModule['default']
  ensureMapboxCss(doc, (mapbox as { version?: string }).version)
  return mapbox
}

/**
 * Angular port of the UIPKGE Map (Mapbox GL JS). Standalone.
 * Class strings come from shared `mapVariants` — identical to Vue/React.
 *
 * Mapbox GL touches `window`/`document`, so the module is loaded lazily on
 * the client only (`await import('mapbox-gl')` inside `ngAfterViewInit`).
 * Provide `accessToken`; without a token the host renders only a
 * "token required" placeholder (no map element), exactly like React.
 *
 * Styles: nothing to import. The first `<ui-map>` puts the design-system chrome
 * (`map.css`, shipped beside this file) into `<head>`, and on first map creation
 * Mapbox GL's own stylesheet is linked from Mapbox's CDN for the installed
 * version. To self-host it instead (CSP, offline), add
 * `node_modules/mapbox-gl/dist/mapbox-gl.css` to `styles` in angular.json;
 * the component detects it and skips the CDN link.
 *
 * Markers: drop `<ui-map-marker [lngLat]="[lng, lat]" anchor="center">` with any
 * HTML inside into the content slot (React/Vue `MapMarker`).
 *
 * Declarative `sources`/`layers` inputs mirror the `<ui-map-source>` /
 * `<ui-map-layer>` slot children for consumers that prefer data over slots.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-map, [ui-map]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"map"',
    '[attr.data-variant]': 'variant',
    '[attr.data-muted]': 'isMuted',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
  },
  template: `
    @if (hasToken) {
      <div #mapEl class="size-full"></div>
    } @else {
      <div
        class="text-muted-foreground flex size-full flex-col items-center justify-center gap-1 px-6 text-center text-sm"
      >
        <span class="text-foreground font-medium">Mapbox token required</span>
        <span>Pass an access token to render the map.</span>
      </div>
    }
    <ng-content />
  `,
})
export class UiMapComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() accessToken = ''
  @Input() variant: MapVariant = 'default'
  @Input() size?: MapSize
  /** Override the base style. Defaults to the variant or a theme-aware light/dark style. */
  @Input() mapStyle?: string
  /** Alias for `mapStyle` (matches the "style" input shorthand). */
  @Input() style?: string
  /** Initial [lng, lat]. */
  @Input() center: [number, number] = [0, 20]
  @Input() zoom = 1.4
  @Input() pitch = 0
  @Input() bearing = 0
  @Input() buildings3d = false
  @Input() terrain3d = false
  @Input() projection = 'mercator'
  @Input() navigation = true
  @Input() navigationPosition: MapNavigationPosition = 'bottom-right'
  @Input() showCompass?: boolean
  @Input() showZoom = true
  @Input() fullscreen = false
  @Input() fullscreenPosition: MapNavigationPosition = 'top-right'
  /** Repaint the basemap to a quiet, desaturated canvas. */
  @Input() muted = false
  /** Declarative sources (alternative to `<ui-map-source>` slot children). */
  @Input() sources: MapSourceInput[] = []
  /** Declarative layers (alternative to `<ui-map-layer>` slot children). */
  @Input() layers: MapLayerInput[] = []
  @Input('class') className?: string

  /** Emits the raw mapbox-gl Map once the style is ready. */
  @Output() created = new EventEmitter<mapboxgl.Map>()

  mapEl?: ElementRef<HTMLDivElement>
  /** The map element only exists with a token; a token that arrives later creates the map then. */
  @ViewChild('mapEl', { static: false }) set mapElRef(el: ElementRef<HTMLDivElement> | undefined) {
    this.mapEl = el
    if (!el || !this.viewReady) return
    this.resizeObserver?.observe(el.nativeElement)
    if (!this.map) void this.createMap()
  }

  private viewReady = false
  private mapListeners: Array<(map: mapboxgl.Map) => void> = []

  private map: mapboxgl.Map | null = null
  private navControl: mapboxgl.NavigationControl | null = null
  private fullscreenControl: mapboxgl.FullscreenControl | null = null
  private themeObserver: MutationObserver | null = null
  private resizeObserver: ResizeObserver | null = null
  private dark = false
  private inited = false

  /** Calls `cb` with the mapbox-gl Map as soon as it exists (before the style loads, like react-map-gl children). */
  whenMap(cb: (map: mapboxgl.Map) => void): () => void {
    if (this.map) {
      cb(this.map)
      return () => {}
    }
    this.mapListeners.push(cb)
    return () => {
      this.mapListeners = this.mapListeners.filter((l) => l !== cb)
    }
  }

  get isMuted(): boolean {
    return this.muted || this.variant === 'muted'
  }

  get hasToken(): boolean {
    return this.resolveToken().length > 0
  }

  get hostClass(): string {
    return cn(
      'block',
      mapVariants({ variant: this.variant, ...(this.size ? { size: this.size } : {}) }),
      this.className,
    )
  }

  resolveToken(): string {
    return this.accessToken
  }

  /** Resolve the style URL: explicit `style`/`mapStyle` wins, then the variant preset, then theme-aware light/dark. */
  resolveStyle(): string {
    const override = this.style ?? this.mapStyle
    if (override) return override
    if (this.variant && this.variant !== 'default' && this.variant !== 'muted') {
      const preset = MAPBOX_STYLES[this.variant as keyof typeof MAPBOX_STYLES]
      if (preset) return preset
    }
    return this.dark ? 'mapbox://styles/mapbox/dark-v11' : 'mapbox://styles/mapbox/light-v11'
  }

  /** The underlying mapbox-gl Map, or null until created. */
  getMap(): mapboxgl.Map | null {
    return this.map
  }

  flyTo(...args: Parameters<mapboxgl.Map['flyTo']>): unknown {
    return this.map?.flyTo(...args)
  }

  easeTo(...args: Parameters<mapboxgl.Map['easeTo']>): unknown {
    return this.map?.easeTo(...args)
  }

  jumpTo(...args: Parameters<mapboxgl.Map['jumpTo']>): unknown {
    return this.map?.jumpTo(...args)
  }

  fitBounds(...args: Parameters<mapboxgl.Map['fitBounds']>): unknown {
    return this.map?.fitBounds(...args)
  }

  resize(): void {
    this.map?.resize()
  }

  async ngAfterViewInit(): Promise<void> {
    if (typeof document === 'undefined' || typeof window === 'undefined') return
    // Client-only (like mapbox-gl itself), so `new UiMapComponent()` stays usable outside DI.
    ensureMapCss(document)
    const root = document.documentElement
    const syncTheme = () => {
      this.dark = root.classList.contains('dark')
    }
    syncTheme()
    this.themeObserver = new MutationObserver(syncTheme)
    this.themeObserver.observe(root, { attributes: true, attributeFilter: ['class'] })
    this.viewReady = true
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => this.map?.resize())
      if (this.mapEl?.nativeElement) this.resizeObserver.observe(this.mapEl.nativeElement)
    }
    if (!this.hasToken || !this.mapEl?.nativeElement) return
    await this.createMap()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.map || !this.inited) return
    if (changes['pitch'] && this.pitch !== undefined) {
      try {
        this.map.setPitch(this.pitch)
      } catch {
        /* ignore */
      }
    }
    if (changes['bearing'] && this.bearing !== undefined) {
      try {
        this.map.setBearing(this.bearing)
      } catch {
        /* ignore */
      }
    }
    if (changes['navigation'] || changes['navigationPosition'] || changes['showCompass'] || changes['showZoom']) {
      void this.updateNavControl()
    }
    if (changes['fullscreen'] || changes['fullscreenPosition']) {
      void this.updateFullscreenControl()
    }
    if ((changes['sources'] || changes['layers']) && this.map.isStyleLoaded()) {
      this.applySourcesAndLayers()
    }
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect()
    this.resizeObserver = null
    this.themeObserver?.disconnect()
    this.themeObserver = null
    try {
      this.map?.remove()
    } catch {
      /* already destroyed */
    }
    this.map = null
    this.mapListeners = []
  }

  private async createMap(): Promise<void> {
    const el = this.mapEl?.nativeElement
    if (!el || this.map) return
    const mapbox = await loadMapbox(el.ownerDocument)
    if (this.map || !this.mapEl) return
    mapbox.accessToken = this.resolveToken()
    const map = new mapbox.Map({
      container: el,
      style: this.resolveStyle(),
      center: this.center,
      zoom: this.zoom,
      attributionControl: false,
    })
    this.map = map as unknown as mapboxgl.Map
    const listeners = this.mapListeners
    this.mapListeners = []
    for (const cb of listeners) cb(this.map)
    this.map.resize()
    try {
      ;(this.map as unknown as { setProjection: (p: string) => void }).setProjection(this.projection)
    } catch {
      /* older api */
    }
    if (this.pitch) {
      try {
        this.map.setPitch(this.pitch)
      } catch {
        /* ignore */
      }
    }
    if (this.bearing) {
      try {
        this.map.setBearing(this.bearing)
      } catch {
        /* ignore */
      }
    }
    await this.updateNavControl()
    await this.updateFullscreenControl()
    if (!this.map) return
    const ready = () => {
      if (this.isMuted) this.applyMuted()
      if (this.buildings3d) this.apply3DBuildings()
      if (this.terrain3d) this.apply3DTerrain()
      this.applySourcesAndLayers()
      this.inited = true
      if (this.map) this.created.emit(this.map)
    }
    if (this.map.isStyleLoaded()) ready()
    else this.map.once('load', ready)
    this.map.on('style.load', () => {
      if (this.isMuted) this.applyMuted()
      if (this.buildings3d) this.apply3DBuildings()
      if (this.terrain3d) this.apply3DTerrain()
      this.applySourcesAndLayers()
    })
  }

  private async updateNavControl(): Promise<void> {
    if (!this.map) return
    const mod = await import('mapbox-gl')
    const mapbox = mod.default ?? mod
    if (!this.map) return
    if (this.navControl) {
      try {
        this.map.removeControl(this.navControl)
      } catch {
        /* ignore */
      }
      this.navControl = null
    }
    if (this.navigation) {
      const showCompass = this.showCompass !== undefined ? this.showCompass : (this.pitch ?? 0) > 0
      this.navControl = new mapbox.NavigationControl({ showCompass, showZoom: this.showZoom ?? true })
      this.map.addControl(this.navControl, this.navigationPosition ?? 'bottom-right')
    }
  }

  private async updateFullscreenControl(): Promise<void> {
    if (!this.map) return
    const mod = await import('mapbox-gl')
    const mapbox = mod.default ?? mod
    if (!this.map) return
    if (this.fullscreenControl) {
      try {
        this.map.removeControl(this.fullscreenControl)
      } catch {
        /* ignore */
      }
      this.fullscreenControl = null
    }
    if (this.fullscreen) {
      this.fullscreenControl = new mapbox.FullscreenControl()
      this.map.addControl(this.fullscreenControl, this.fullscreenPosition ?? 'top-right')
    }
  }

  /** Desaturate the basemap to a quiet canvas. Each op is guarded — style layer ids drift between style versions. */
  private applyMuted(): void {
    const map = this.map
    if (!map) return
    let styleLayers: Array<{ id: string; type: string }>
    try {
      styleLayers = (map.getStyle()?.layers as Array<{ id: string; type: string }>) ?? []
    } catch {
      return
    }
    const P = this.dark
      ? {
          land: 'rgb(24,24,27)',
          water: 'rgb(39,39,42)',
          use: 'rgb(30,30,34)',
          road: 'rgb(45,46,52)',
          label: 'rgb(161,161,170)',
          halo: 'rgb(24,24,27)',
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

  private apply3DBuildings(): void {
    const map = this.map
    if (!map || !this.buildings3d || map.getLayer('3d-buildings')) return
    const layers = map.getStyle()?.layers
    let labelLayerId: string | undefined
    if (layers) {
      for (const layer of layers) {
        if (layer.type === 'symbol' && (layer.layout as Record<string, unknown> | undefined)?.['text-field']) {
          labelLayerId = layer.id
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
            'fill-extrusion-color': this.dark ? '#27272a' : '#d4d4d8',
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

  private apply3DTerrain(): void {
    const map = this.map
    if (!map || !this.terrain3d) return
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

  /** Apply the declarative `sources`/`layers` inputs onto the live map. No-ops until the style is loaded. */
  applySourcesAndLayers(): void {
    const map = this.map
    if (!map) return
    try {
      if (!map.isStyleLoaded()) return
    } catch {
      return
    }
    for (const s of this.sources ?? []) {
      try {
        if (!map.getSource(s.id)) map.addSource(s.id, UiMapSourceComponent.buildSourceOptions(s))
      } catch {
        /* retry on next style.load */
      }
    }
    for (const l of this.layers ?? []) {
      try {
        if (!map.getLayer(l.id)) map.addLayer(UiMapLayerComponent.buildLayerConfig(l), l.beforeId)
      } catch {
        /* retry on next style.load */
      }
    }
  }
}

export { mapVariants, MAPBOX_STYLES, type MapVariant, type MapVariants }

/**
 * Declarative GeoJSON (or any) source for `<ui-map>`. Slot children
 * (`<ui-map-layer>`) inherit this source id.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-map-source, [ui-map-source]',
  standalone: true,
  host: {
    '[attr.data-map-source-id]': 'id',
    '[attr.data-uipkge]': '""',
  },
  template: `<ng-content />`,
})
export class UiMapSourceComponent {
  @Input() id!: string
  @Input() type = 'geojson'
  @Input() data?: unknown
  @Input() options?: mapboxgl.AnySourceData

  static buildSourceOptions(s: {
    type?: string
    data?: unknown
    options?: mapboxgl.AnySourceData
  }): mapboxgl.AnySourceData {
    if (s.options) return s.options
    return { type: (s.type || 'geojson') as 'geojson', data: s.data } as mapboxgl.AnySourceData
  }

  getSourceOptions(): mapboxgl.AnySourceData {
    return UiMapSourceComponent.buildSourceOptions({ type: this.type, data: this.data, options: this.options })
  }
}

/**
 * Declarative layer for `<ui-map>` / `<ui-map-source>`. When `options` is
 * given it carries its own `type`; otherwise the flat `type` input is used.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-map-layer, [ui-map-layer]',
  standalone: true,
  host: {
    '[attr.data-map-layer-id]': 'id',
    '[attr.data-uipkge]': '""',
  },
  template: `<ng-content />`,
})
export class UiMapLayerComponent {
  @Input() id!: string
  @Input() type?: string
  @Input() source?: string
  @Input() paint: Record<string, unknown> = {}
  @Input() layout: Record<string, unknown> = {}
  @Input() beforeId?: string
  @Input() options?: Partial<mapboxgl.AnyLayer>

  static buildLayerConfig(l: {
    id: string
    type?: string
    source?: string
    paint?: Record<string, unknown>
    layout?: Record<string, unknown>
    options?: Partial<mapboxgl.AnyLayer>
  }): mapboxgl.AnyLayer {
    if (l.options) return { ...l.options, id: l.id } as mapboxgl.AnyLayer
    return {
      id: l.id,
      type: l.type,
      source: l.source,
      paint: l.paint || {},
      layout: l.layout || {},
    } as unknown as mapboxgl.AnyLayer
  }

  getLayerConfig(): mapboxgl.AnyLayer {
    return UiMapLayerComponent.buildLayerConfig({
      id: this.id,
      type: this.type,
      source: this.source,
      paint: this.paint,
      layout: this.layout,
      options: this.options,
    })
  }
}

export type MapMarkerAnchor = mapboxgl.Anchor

/**
 * HTML marker for `<ui-map>` (React/Vue `MapMarker`). Its content is handed to a
 * mapbox-gl `Marker` once the parent map exists, which moves that element onto the
 * map; the host itself stays hidden where it was declared.
 *
 *   <ui-map-marker [lngLat]="[-98.5, 39.8]" anchor="center"><button>NA</button></ui-map-marker>
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-map-marker, [ui-map-marker]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"map-marker"',
    '[attr.data-uipkge]': '""',
    class: 'hidden',
  },
  template: `<div #markerEl><ng-content /></div>`,
})
export class UiMapMarkerComponent implements AfterViewInit, OnChanges, OnDestroy {
  /** [lng, lat] — matches React/Vue `lngLat`. */
  @Input({ required: true }) lngLat!: [number, number]
  /** Which part of the element sits on `lngLat`. Mapbox's default is 'center'. */
  @Input() anchor: MapMarkerAnchor = 'center'

  @ViewChild('markerEl', { static: true }) private markerEl!: ElementRef<HTMLDivElement>

  private readonly parent = inject(UiMapComponent, { optional: true })
  private readonly doc = inject(DOCUMENT)
  private marker: mapboxgl.Marker | null = null
  private map: mapboxgl.Map | null = null
  private stopWaiting: (() => void) | null = null
  private destroyed = false

  /** The mapbox-gl Marker, or null until the map exists. */
  getMarker(): mapboxgl.Marker | null {
    return this.marker
  }

  ngAfterViewInit(): void {
    this.stopWaiting = this.parent?.whenMap((map) => void this.attach(map)) ?? null
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.marker) return
    if (changes['anchor'] && this.map) {
      void this.attach(this.map)
    } else if (changes['lngLat'] && this.lngLat) {
      this.marker.setLngLat(this.lngLat)
    }
  }

  ngOnDestroy(): void {
    this.destroyed = true
    this.stopWaiting?.()
    this.marker?.remove()
    this.marker = null
    this.map = null
  }

  private async attach(map: mapboxgl.Map): Promise<void> {
    const mapbox = await loadMapbox(this.doc)
    if (this.destroyed) return
    this.marker?.remove()
    this.map = map
    this.marker = new mapbox.Marker({ element: this.markerEl.nativeElement, anchor: this.anchor })
      .setLngLat(this.lngLat)
      .addTo(map)
  }
}

export type MapPopupAnchor = mapboxgl.Anchor

/**
 * Popup dialog for `<ui-map>` (React/Vue `MapPopup`). Its content is handed to a
 * mapbox-gl `Popup` once the parent map exists, which moves that element onto the
 * map; the host itself stays hidden where it was declared. Render conditionally
 * (`@if (active)`) like React's `{active && <MapPopup>}` for selection popups.
 *
 *   <ui-map-marker [lngLat]="hq" anchor="bottom">…</ui-map-marker>
 *   @if (active === 'hq') {
 *     <ui-map-popup [lngLat]="hq" [offset]="[0, -32]" (close)="active = null">…</ui-map-popup>
 *   }
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-map-popup, [ui-map-popup]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"map-popup"',
    '[attr.data-uipkge]': '""',
    class: 'hidden',
  },
  template: `<div #popupEl><ng-content /></div>`,
})
export class UiMapPopupComponent implements AfterViewInit, OnChanges, OnDestroy {
  /** [lng, lat] — matches React/Vue `lngLat`. */
  @Input({ required: true }) lngLat!: [number, number]
  @Input() anchor?: MapPopupAnchor
  @Input() offset?: [number, number] | number
  @Input() closeButton?: boolean
  @Input() closeOnClick?: boolean
  @Input() closeOnMove?: boolean
  @Input() maxWidth?: string
  /** Extra class for the popup content (React `className`). */
  @Input() className?: string
  /** Fired when the popup closes (React `onClose` / Vue `@close`). */
  @Output() close = new EventEmitter<void>()

  @ViewChild('popupEl', { static: true }) private popupEl!: ElementRef<HTMLDivElement>

  private readonly parent = inject(UiMapComponent, { optional: true })
  private readonly doc = inject(DOCUMENT)
  private popup: mapboxgl.Popup | null = null
  private map: mapboxgl.Map | null = null
  private stopWaiting: (() => void) | null = null
  private destroyed = false

  /** The mapbox-gl Popup, or null until the map exists. */
  getPopup(): mapboxgl.Popup | null {
    return this.popup
  }

  buildOptions(): mapboxgl.PopupOptions {
    const opts: Record<string, unknown> = {
      anchor: this.anchor,
      offset: this.offset,
      closeButton: this.closeButton,
      closeOnClick: this.closeOnClick,
      closeOnMove: this.closeOnMove,
      maxWidth: this.maxWidth,
      className: this.className,
    }
    return Object.fromEntries(Object.entries(opts).filter(([, v]) => v !== undefined)) as mapboxgl.PopupOptions
  }

  ngAfterViewInit(): void {
    this.stopWaiting = this.parent?.whenMap((map) => void this.attach(map)) ?? null
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.popup) return
    const optionKeys = ['anchor', 'offset', 'closeButton', 'closeOnClick', 'closeOnMove', 'maxWidth', 'className']
    if (optionKeys.some((k) => changes[k]) && this.map) {
      void this.attach(this.map)
    } else if (changes['lngLat'] && this.lngLat) {
      this.popup.setLngLat(this.lngLat)
    }
  }

  ngOnDestroy(): void {
    this.destroyed = true
    this.stopWaiting?.()
    this.popup?.remove()
    this.popup = null
    this.map = null
  }

  private async attach(map: mapboxgl.Map): Promise<void> {
    const mapbox = await loadMapbox(this.doc)
    if (this.destroyed) return
    this.popup?.remove()
    this.map = map
    this.popup = new mapbox.Popup(this.buildOptions())
      .setLngLat(this.lngLat)
      .setDOMContent(this.popupEl.nativeElement)
      .addTo(map)
    this.popup.on('close', () => this.close.emit())
  }
}
