import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
  booleanAttribute,
  forwardRef,
  inject,
  signal,
} from '@angular/core'
import type * as L from 'leaflet'
import { cn } from '@/lib/utils'
import {
  LEAFLET_TILES,
  LEAFLET_THEME_TILES,
  leafletMapVariants,
  type LeafletMapVariant,
  type LeafletMapVariants,
  type LeafletTilePreset,
} from './leaflet-map.variants'
import {
  defined,
  fixDefaultLeafletIcon,
  loadLeaflet,
  toLatLng,
  toLatLngBounds,
  toLatLngs,
  type LeafletModule,
  type LeafletPosition,
} from './leaflet-context'
import { ensureLeafletStyles } from './leaflet-map.styles'

export type LeafletMapSize = NonNullable<LeafletMapVariants['size']>

export type LeafletMarkerAnchor =
  'center' | 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

type MapCallback = (map: L.Map, Lmod: LeafletModule) => void

const CORNER_ORDER: LeafletPosition[] = ['top-left', 'top-right', 'bottom-left', 'bottom-right']

/**
 * Angular port of the UIPKGE LeafletMap: a thin, theme-aware Leaflet wrapper rendering free
 * raster tiles (no API key). Standalone. Class strings come from shared `leafletMapVariants`
 * and the chrome markup (zoom group, fullscreen button, ⓘ attribution) is the React markup.
 *
 * Styles: the React item imports `leaflet/dist/leaflet.css` + `leaflet-map.css`. Here both
 * live in `leaflet-map.styles.ts` and the map injects them into `<head>` once on construction
 * (`<style data-uipkge-leaflet>`), so an installed item works with no angular.json edits.
 * Already loading `leaflet/dist/leaflet.css` globally is harmless (identical rules).
 *
 * Children draw themselves once the map exists and follow their inputs, like React:
 * - `<ui-leaflet-marker>`: projected content becomes a custom div-icon (the real DOM nodes are
 *   moved into the icon, so bindings and listeners keep working); `anchor` picks which point
 *   of that content sits on the coordinate. With no content it uses Leaflet's default pin.
 * - `<ui-leaflet-popup>`: binds to its parent marker / path (or opens standalone at `lngLat`);
 *   its content is moved into the popup, bindings stay live.
 * - `<ui-leaflet-tooltip>`: same, but a hover tooltip.
 * - `<ui-leaflet-polyline>`, `<ui-leaflet-polygon>`, `<ui-leaflet-circle>`,
 *   `<ui-leaflet-circle-marker>` (pixel radius), `<ui-leaflet-geojson>`, `<ui-leaflet-tile-layer>`.
 * Use `created` (the raw L.Map) for anything else.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-leaflet-map, [ui-leaflet-map]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"leaflet-map"',
    '[attr.data-variant]': 'variant',
    '[attr.data-muted]': 'isMuted',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
  },
  template: `
    <div #mapEl class="size-full"></div>
    @for (corner of cornerOrder; track corner) {
      @if (showZoomAt(corner) || showFullscreenAt(corner)) {
        <div [class]="cornerClass(corner)">
          @if (showZoomAt(corner)) {
            <div
              class="border-border bg-card divide-border flex flex-col divide-y overflow-hidden rounded-lg border shadow-sm"
            >
              <button
                type="button"
                class="text-muted-foreground hover:bg-muted flex size-8 items-center justify-center transition-colors disabled:pointer-events-none disabled:opacity-40"
                aria-label="Zoom in"
                [disabled]="!canZoomIn()"
                (click)="zoomIn()"
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
                [disabled]="!canZoomOut()"
                (click)="zoomOut()"
              >
                <svg class="size-full" viewBox="0 0 29 29" fill="currentColor" aria-hidden="true">
                  <path d="M10 13c-.75 0-1.5.75-1.5 1.5S9.25 16 10 16h9c.75 0 1.5-.75 1.5-1.5S19.75 13 19 13h-9z" />
                </svg>
              </button>
            </div>
          }
          @if (showFullscreenAt(corner)) {
            <button
              type="button"
              class="border-border bg-card text-muted-foreground hover:bg-muted flex size-8 items-center justify-center rounded-lg border shadow-sm transition-colors"
              aria-label="Toggle fullscreen"
              (click)="toggleFullscreen()"
            >
              <svg class="size-full" viewBox="0 0 29 29" fill="currentColor" aria-hidden="true">
                @if (isFullscreen()) {
                  <path
                    d="M18.5 16c-1.75 0-2.5.75-2.5 2.5V24h1l1.5-3 5.5 4 1-1-4-5.5 3-1.5v-1h-5.5zM13 18.5c0-1.75-.75-2.5-2.5-2.5H5v1l3 1.5L4 24l1 1 5.5-4 1.5 3h1v-5.5zm3-8c0 1.75.75 2.5 2.5 2.5H24v-1l-3-1.5L25 5l-1-1-5.5 4L17 5h-1v5.5zM10.5 13c1.75 0 2.5-.75 2.5-2.5V5h-1l-1.5 3L5 4 4 5l4 5.5L5 12v1h5.5z"
                  />
                } @else {
                  <path
                    d="M24 16v5.5c0 1.75-.75 2.5-2.5 2.5H16v-1l3-1.5-4-5.5 1-1 5.5 4 1.5-3h1zM6 16l1.5 3 5.5-4 1 1-4 5.5 3 1.5v1H7.5C5.75 24 5 23.25 5 21.5V16h1zm7-11v1l-3 1.5 4 5.5-1 1-5.5-4L6 13H5V7.5C5 5.75 5.75 5 7.5 5H13zm11 2.5c0-1.75-.75-2.5-2.5-2.5H16v1l3 1.5-4 5.5 1 1 5.5-4 1.5 3h1V7.5z"
                  />
                }
              </svg>
            </button>
          }
        </div>
      }
    }
    @if (mapReady() && attribution && attributions().length > 0) {
      <div class="group absolute bottom-3 left-3 z-[1000] flex flex-col items-start gap-1.5">
        <div role="note" [class]="attributionClass()" [innerHTML]="attributions().join(' | ')"></div>
        <button
          type="button"
          class="border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground flex size-4 items-center justify-center rounded-full border shadow-xs transition-colors"
          aria-label="Map data attribution"
          [attr.aria-expanded]="showAttribution()"
          (click)="showAttribution.set(!showAttribution())"
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
      </div>
    }
    <ng-content />
  `,
})
export class UiLeafletMapComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() variant: LeafletMapVariant = 'default'
  @Input() size?: LeafletMapSize
  /** Custom raster tile URL template — overrides `variant`. */
  @Input() tileUrl?: string
  @Input() tileAttribution?: string
  @Input() tileSubdomains?: string | string[]
  /** Initial [lng, lat] — Mapbox order, matching the `map` component. */
  @Input() center: [number, number] = [0, 20]
  @Input() zoom = 2
  @Input() minZoom?: number
  @Input() maxZoom?: number
  /** Show the zoom +/- control. */
  @Input({ transform: booleanAttribute }) navigation = true
  @Input() navigationPosition: LeafletPosition = 'bottom-right'
  /** Show the HTML5 fullscreen toggle button. */
  @Input({ transform: booleanAttribute }) fullscreen = false
  @Input() fullscreenPosition: LeafletPosition = 'top-right'
  /** Show tile credits behind a ⓘ button (hover/tap). Keep on — OSM/Esri tiles require attribution. */
  @Input({ transform: booleanAttribute }) attribution = true
  @Input({ transform: booleanAttribute }) scrollWheelZoom = true
  @Input({ transform: booleanAttribute }) muted = false
  @Input('class') className?: string

  @Output() created = new EventEmitter<L.Map>()

  @ViewChild('mapEl', { static: false }) mapEl?: ElementRef<HTMLDivElement>

  readonly cornerOrder = CORNER_ORDER
  readonly mapReady = signal(false)
  readonly canZoomIn = signal(true)
  readonly canZoomOut = signal(true)
  readonly isFullscreen = signal(false)
  readonly attributions = signal<string[]>([])
  readonly showAttribution = signal(false)

  private map: L.Map | null = null
  private Lmod: LeafletModule | null = null
  private baseLayer: L.TileLayer | null = null
  private overlayLayer: L.TileLayer | null = null
  private themeObserver: MutationObserver | null = null
  private resizeObserver: ResizeObserver | null = null
  private intersectionObserver: IntersectionObserver | null = null
  private readonly mapCallbacks = new Set<MapCallback>()
  private destroyed = false
  private creating = false
  private dark = false
  private readonly onFullscreenChange = () => this.isFullscreen.set(Boolean(document.fullscreenElement))

  constructor() {
    // No inject() here: the map must stay constructible with plain `new` (host-display spec).
    ensureLeafletStyles()
  }

  /** The component host (the map element's parent), fullscreen / in-view target. */
  private get hostElement(): HTMLElement | null {
    return this.mapEl?.nativeElement.parentElement ?? null
  }

  get isMuted(): boolean {
    return this.muted || this.variant === 'muted'
  }

  get hostClass(): string {
    return cn(
      'block',
      leafletMapVariants({ variant: this.variant, ...(this.size ? { size: this.size } : {}) }),
      this.className,
    )
  }

  showZoomAt(corner: LeafletPosition): boolean {
    return this.mapReady() && this.navigation && (this.navigationPosition ?? 'bottom-right') === corner
  }

  showFullscreenAt(corner: LeafletPosition): boolean {
    return this.mapReady() && this.fullscreen && (this.fullscreenPosition ?? 'top-right') === corner
  }

  /** Corner stack placement; bottom-left sits above the ⓘ button when credits are shown. */
  cornerClass(corner: LeafletPosition): string {
    let placement: string
    switch (corner) {
      case 'top-left':
        placement = 'left-3 top-3'
        break
      case 'top-right':
        placement = 'right-3 top-3'
        break
      case 'bottom-left':
        placement = this.attribution && this.attributions().length ? 'bottom-9 left-3' : 'bottom-3 left-3'
        break
      default:
        placement = 'bottom-3 right-3'
    }
    return cn('absolute z-[1000] flex flex-col gap-2.5', placement)
  }

  attributionClass(): string {
    return cn(
      'border-border bg-popover text-popover-foreground max-w-64 rounded-md border px-2.5 py-1.5 text-[11px] leading-relaxed shadow-md transition-opacity [&_a]:underline',
      this.showAttribution()
        ? 'visible opacity-100'
        : 'invisible opacity-0 group-hover:visible group-hover:opacity-100',
    )
  }

  /** Resolve the tile preset: explicit `tileUrl` wins, then the variant preset, then theme-aware light/dark. */
  resolveTiles(): LeafletTilePreset {
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
    if (this.variant && this.variant !== 'default' && this.variant !== 'muted') {
      const preset = LEAFLET_TILES[this.variant as keyof typeof LEAFLET_TILES]
      if (preset) return preset
    }
    return this.dark ? LEAFLET_THEME_TILES.dark : LEAFLET_THEME_TILES.light
  }

  getMap(): L.Map | null {
    return this.map
  }

  /**
   * Runs `cb` with the map once it exists (immediately if it already does). Returns an
   * unsubscribe for callers destroyed before the map is created. Used by the child layers.
   */
  whenMap(cb: MapCallback): () => void {
    if (this.map && this.Lmod) {
      cb(this.map, this.Lmod)
      return () => {}
    }
    this.mapCallbacks.add(cb)
    return () => this.mapCallbacks.delete(cb)
  }

  /** Mapbox-style camera shim — accepts { center: [lng, lat], zoom, duration(ms) }. */
  flyTo(options: { center?: [number, number]; zoom?: number; duration?: number } = {}): void {
    const m = this.map
    if (!m) return
    m.flyTo(options.center ? toLatLng(options.center) : m.getCenter(), options.zoom ?? m.getZoom(), {
      duration: (options.duration ?? 800) / 1000,
    })
  }

  setView(options: { center?: [number, number]; zoom?: number } = {}): void {
    const m = this.map
    if (!m) return
    m.setView(options.center ? toLatLng(options.center) : m.getCenter(), options.zoom ?? m.getZoom())
  }

  jumpTo(options: { center?: [number, number]; zoom?: number } = {}): void {
    const m = this.map
    if (!m) return
    m.setView(options.center ? toLatLng(options.center) : m.getCenter(), options.zoom ?? m.getZoom(), {
      animate: false,
    })
  }

  fitBounds(
    bounds: [[number, number], [number, number]] | L.LatLngBoundsExpression,
    options?: L.FitBoundsOptions,
  ): void {
    this.map?.fitBounds(toLatLngBounds(bounds as [[number, number], [number, number]]), options)
  }

  panTo(center: [number, number]): void {
    this.map?.panTo(toLatLng(center))
  }

  zoomIn(): void {
    this.map?.zoomIn()
  }

  zoomOut(): void {
    this.map?.zoomOut()
  }

  resize(): void {
    this.map?.invalidateSize()
  }

  toggleFullscreen(): void {
    const el = this.hostElement
    if (!el) return
    if (document.fullscreenElement) void document.exitFullscreen()
    else void el.requestFullscreen?.()
  }

  ngAfterViewInit(): void {
    if (typeof document === 'undefined' || typeof window === 'undefined') return
    const root = document.documentElement
    const syncTheme = () => {
      const wasDark = this.dark
      this.dark = root.classList.contains('dark')
      if (wasDark !== this.dark && this.map) this.applyTiles(this.resolveTiles())
    }
    syncTheme()
    this.themeObserver = new MutationObserver(syncTheme)
    this.themeObserver.observe(root, { attributes: true, attributeFilter: ['class'] })
    document.addEventListener('fullscreenchange', this.onFullscreenChange)
    const el = this.mapEl?.nativeElement
    if (typeof ResizeObserver !== 'undefined' && el) {
      // Next frame: resizing the map inside the callback changes layout again, which the browser
      // reports as a "ResizeObserver loop" error (logged as ERROR by Angular's global listeners).
      this.resizeObserver = new ResizeObserver(() => requestAnimationFrame(() => this.map?.invalidateSize()))
      this.resizeObserver.observe(el)
    }
    // Like React: only create the map once it scrolls near the viewport.
    const host = this.hostElement
    if (host && typeof IntersectionObserver !== 'undefined') {
      this.intersectionObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) void this.createMap()
        },
        { rootMargin: '160px', threshold: 0.01 },
      )
      this.intersectionObserver.observe(host)
    } else {
      void this.createMap()
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['attribution'] && !this.attribution) this.showAttribution.set(false)
    if (!this.map || !this.Lmod) return
    // Compare coordinates, not array identity: a parent that rebuilds the
    // `[lng, lat]` array each change-detection pass must not snap the view back.
    const prev = changes['center']?.previousValue as [number, number] | undefined
    const centerMoved =
      !!changes['center'] && !(prev && prev[0] === this.center?.[0] && prev[1] === this.center?.[1])
    if (centerMoved || changes['zoom']) {
      this.map.setView(toLatLng(this.center), this.zoom)
    }
    if (changes['variant'] || changes['tileUrl'] || changes['tileAttribution'] || changes['tileSubdomains']) {
      this.applyTiles(this.resolveTiles())
    }
    if (changes['scrollWheelZoom']) {
      if (this.scrollWheelZoom) this.map.scrollWheelZoom.enable()
      else this.map.scrollWheelZoom.disable()
    }
  }

  ngOnDestroy(): void {
    this.destroyed = true
    this.mapCallbacks.clear()
    this.intersectionObserver?.disconnect()
    this.intersectionObserver = null
    this.resizeObserver?.disconnect()
    this.resizeObserver = null
    this.themeObserver?.disconnect()
    this.themeObserver = null
    if (typeof document !== 'undefined') document.removeEventListener('fullscreenchange', this.onFullscreenChange)
    try {
      this.map?.remove()
    } catch {
      /* already destroyed */
    }
    this.map = null
  }

  private async createMap(): Promise<void> {
    const el = this.mapEl?.nativeElement
    if (!el || this.map || this.creating) return
    this.creating = true
    const Lmod = await loadLeaflet()
    if (this.destroyed || this.map) return
    this.intersectionObserver?.disconnect()
    this.intersectionObserver = null
    this.Lmod = Lmod
    fixDefaultLeafletIcon(Lmod)
    const tiles = this.resolveTiles()
    const m = Lmod.map(
      el,
      defined({
        center: toLatLng(this.center ?? [0, 20]),
        zoom: this.zoom,
        minZoom: this.minZoom,
        maxZoom: this.maxZoom ?? tiles.maxZoom,
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: this.scrollWheelZoom,
      }),
    )
    this.map = m
    this.applyTiles(tiles)
    m.on('zoomend', () => this.syncZoomBounds())
    this.syncZoomBounds()
    m.on('layeradd layerremove', () => this.collectAttributions())
    this.collectAttributions()
    this.mapReady.set(true)
    const pending = [...this.mapCallbacks]
    this.mapCallbacks.clear()
    for (const cb of pending) cb(m, Lmod)
    this.created.emit(m)
  }

  private syncZoomBounds(): void {
    const m = this.map
    if (!m) return
    this.canZoomIn.set(m.getZoom() < m.getMaxZoom())
    this.canZoomOut.set(m.getZoom() > m.getMinZoom())
  }

  /** Attribution strings from every layer (base tiles, overlays, tile-layer children), deduped. */
  private collectAttributions(): void {
    const m = this.map
    if (!m) return
    const seen = new Set<string>()
    m.eachLayer((layer) => {
      const a = (layer as L.TileLayer).options?.attribution
      if (typeof a === 'string' && a) seen.add(a)
    })
    this.attributions.set([...seen])
  }

  private applyTiles(tiles: LeafletTilePreset): void {
    const m = this.map
    const Lmod = this.Lmod
    if (!m || !Lmod) return
    this.baseLayer?.remove()
    this.baseLayer = null
    this.overlayLayer?.remove()
    this.overlayLayer = null
    this.baseLayer = Lmod.tileLayer(
      tiles.url,
      defined({
        attribution: tiles.attribution,
        subdomains: tiles.subdomains,
        maxZoom: tiles.maxZoom ?? 19,
      }),
    )
    this.baseLayer.addTo(m)
    if (tiles.overlayUrl) {
      this.overlayLayer = Lmod.tileLayer(tiles.overlayUrl, { maxZoom: tiles.maxZoom ?? 19 })
      this.overlayLayer.addTo(m)
    }
  }
}

export { leafletMapVariants, LEAFLET_TILES, LEAFLET_THEME_TILES, type LeafletMapVariant, type LeafletMapVariants }

/**
 * Base for children that own a Leaflet layer: waits for the enclosing map, adds the layer,
 * removes it on destroy, and publishes it so a nested `<ui-leaflet-popup>` can bind (React's
 * LeafletLayerContext).
 */
@Directive()
export abstract class LeafletLayerHost<T extends L.Layer = L.Layer> implements AfterViewInit, OnDestroy {
  protected readonly mapHost = inject(UiLeafletMapComponent, { optional: true })
  protected layer: T | null = null
  private readonly layerCallbacks = new Set<(layer: T) => void>()
  private offMap: (() => void) | null = null

  protected abstract build(Lmod: LeafletModule): T

  getLayer(): T | null {
    return this.layer
  }

  /** Runs `cb` with the layer once built (immediately if it already is). */
  whenLayer(cb: (layer: T) => void): () => void {
    if (this.layer) {
      cb(this.layer)
      return () => {}
    }
    this.layerCallbacks.add(cb)
    return () => this.layerCallbacks.delete(cb)
  }

  ngAfterViewInit(): void {
    this.offMap =
      this.mapHost?.whenMap((map, Lmod) => {
        const layer = this.build(Lmod)
        layer.addTo(map)
        this.layer = layer
        this.onLayerAdded(layer)
        const pending = [...this.layerCallbacks]
        this.layerCallbacks.clear()
        for (const cb of pending) cb(layer)
      }) ?? null
  }

  ngOnDestroy(): void {
    this.offMap?.()
    this.offMap = null
    this.layerCallbacks.clear()
    try {
      this.layer?.remove()
    } catch {
      /* map already destroyed */
    }
    this.layer = null
  }

  protected onLayerAdded(_layer: T): void {}
}

/**
 * Marker at `[lng, lat]` (Mapbox order). Projected content (anything but a nested
 * `<ui-leaflet-popup>` / `<ui-leaflet-tooltip>`) becomes a custom div-icon: the nodes are moved into a
 * `.uipkge-leaflet-anchor` element, so bindings and listeners keep working, and `anchor`
 * decides which point of the content sits on the coordinate. No content: Leaflet's default pin.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-leaflet-marker, [ui-leaflet-marker]',
  standalone: true,
  // Content is parked here until the map moves it into the marker icon (React renders nothing).
  host: { hidden: '' },
  providers: [{ provide: LeafletLayerHost, useExisting: forwardRef(() => UiLeafletMarkerComponent) }],
  template: `<ng-content />`,
})
export class UiLeafletMarkerComponent extends LeafletLayerHost<L.Marker> implements OnChanges {
  readonly el = inject<ElementRef<HTMLElement>>(ElementRef)

  /** [lng, lat] — Mapbox order. */
  @Input() lngLat: [number, number] = [0, 0]
  /** Which edge/corner of the marker content sits on the coordinate. */
  @Input() anchor: LeafletMarkerAnchor = 'center'
  @Input() draggable?: boolean
  @Input() opacity?: number
  @Input() zIndexOffset?: number
  @Input() title?: string
  @Input() alt?: string
  @Output() ready = new EventEmitter<L.Marker>()
  /** React `onClick` / Vue `click` on the marker (named `layerClick` — plain `click` would shadow the host's DOM event). */
  @Output() layerClick = new EventEmitter<L.LeafletMouseEvent>()

  /** The `.uipkge-leaflet-anchor` icon element holding the projected content (null for the default pin). */
  iconEl: HTMLElement | null = null

  buildOptions(): L.MarkerOptions {
    return defined({
      interactive: true,
      draggable: this.draggable,
      opacity: this.opacity,
      zIndexOffset: this.zIndexOffset,
      title: this.title,
      alt: this.alt,
    })
  }

  protected build(Lmod: LeafletModule): L.Marker {
    const options = this.buildOptions()
    const host = this.el.nativeElement
    const content = [...(host?.childNodes ?? [])].filter(
      (n) =>
        !(n instanceof Element && n.matches('ui-leaflet-popup, [ui-leaflet-popup], ui-leaflet-tooltip, [ui-leaflet-tooltip]')),
    )
    const hasHtml = content.some((n) => n instanceof Element || (n.nodeType === 3 && n.textContent!.trim() !== ''))
    if (hasHtml) {
      const iconEl = document.createElement('div')
      iconEl.className = 'uipkge-leaflet-anchor'
      iconEl.dataset['anchor'] = this.anchor ?? 'center'
      for (const n of content) iconEl.appendChild(n)
      this.iconEl = iconEl
      options.icon = Lmod.divIcon({ className: 'uipkge-leaflet-div-icon', html: iconEl })
    }
    return Lmod.marker(toLatLng(this.lngLat), options)
  }

  protected override onLayerAdded(marker: L.Marker): void {
    marker.on('click', (ev: L.LeafletMouseEvent) => this.layerClick.emit(ev))
    this.ready.emit(marker)
  }

  ngOnChanges(changes: SimpleChanges): void {
    const m = this.layer
    if (!m) return
    if (changes['lngLat'] && this.lngLat) m.setLatLng(toLatLng(this.lngLat))
    if (changes['opacity'] && this.opacity !== undefined) m.setOpacity(this.opacity)
    if (changes['zIndexOffset'] && this.zIndexOffset !== undefined) m.setZIndexOffset(this.zIndexOffset)
    if (changes['anchor'] && this.iconEl) this.iconEl.dataset['anchor'] = this.anchor ?? 'center'
  }
}

/**
 * Popup bound to the parent marker / path, or opened standalone at `lngLat` on the map.
 * Its content is moved into the popup's content node, so Angular bindings stay live.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-leaflet-popup, [ui-leaflet-popup]',
  standalone: true,
  host: { hidden: '' },
  template: `<ng-content />`,
})
export class UiLeafletPopupComponent implements AfterViewInit, OnDestroy {
  private readonly hostEl = inject<ElementRef<HTMLElement>>(ElementRef, { optional: true })
  private readonly mapHost = inject(UiLeafletMapComponent, { optional: true })
  private readonly parent = inject(LeafletLayerHost, { optional: true })

  /** [lng, lat] — standalone popup on the map. Omit inside a layer to bind to it. */
  @Input() lngLat?: [number, number]
  @Input() maxWidth?: number
  /** Minimum popup width. Defaults to 200 — keeps card-style content from collapsing narrow. */
  @Input() minWidth = 200
  @Input() offset?: [number, number]
  @Input() className?: string
  @Input({ transform: booleanAttribute }) autoClose?: boolean
  @Input({ transform: booleanAttribute }) closeOnClick?: boolean
  @Input({ transform: booleanAttribute }) closeButton?: boolean
  @Input({ transform: booleanAttribute }) keepInView?: boolean

  private off: (() => void) | null = null
  private boundTo: L.Layer | null = null
  private popup: L.Popup | null = null

  buildOptions(): L.PopupOptions {
    return defined({
      maxWidth: this.maxWidth,
      minWidth: this.minWidth,
      offset: this.offset,
      className: this.className,
      autoClose: this.autoClose,
      closeOnClick: this.closeOnClick,
      closeButton: this.closeButton,
      keepInView: this.keepInView,
    } as L.PopupOptions)
  }

  ngAfterViewInit(): void {
    if (this.parent) {
      this.off = this.parent.whenLayer((layer) => {
        this.boundTo = layer
        layer.bindPopup(this.takeContent(), this.buildOptions())
      })
    } else if (this.lngLat && this.mapHost) {
      const lngLat = this.lngLat
      this.off = this.mapHost.whenMap((map, Lmod) => {
        this.popup = Lmod.popup(this.buildOptions()).setLatLng(toLatLng(lngLat)).setContent(this.takeContent())
        this.popup.openOn(map)
      })
    }
  }

  /** Moves the projected nodes into a `.uipkge-leaflet-popup-src` node (React portals there). */
  private takeContent(): HTMLElement {
    const el = document.createElement('div')
    el.className = 'uipkge-leaflet-popup-src'
    for (const n of [...(this.hostEl?.nativeElement?.childNodes ?? [])]) el.appendChild(n)
    return el
  }

  ngOnDestroy(): void {
    this.off?.()
    this.off = null
    try {
      this.boundTo?.unbindPopup()
      this.popup?.remove()
    } catch {
      /* map already destroyed */
    }
    this.boundTo = null
    this.popup = null
  }
}

/**
 * Tooltip bound to the parent marker / path, or floating standalone at `lngLat` on the map.
 * Its content is moved into the tooltip's content node, so Angular bindings stay live.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-leaflet-tooltip, [ui-leaflet-tooltip]',
  standalone: true,
  host: { hidden: '' },
  template: `<ng-content />`,
})
export class UiLeafletTooltipComponent implements AfterViewInit, OnDestroy {
  private readonly hostEl = inject<ElementRef<HTMLElement>>(ElementRef, { optional: true })
  private readonly mapHost = inject(UiLeafletMapComponent, { optional: true })
  private readonly parent = inject(LeafletLayerHost, { optional: true })

  /** [lng, lat] — standalone tooltip on the map. Omit inside a layer to bind to it. */
  @Input() lngLat?: [number, number]
  @Input() offset?: [number, number]
  @Input() direction?: 'top' | 'bottom' | 'left' | 'right' | 'center' | 'auto'
  @Input({ transform: booleanAttribute }) permanent?: boolean
  @Input({ transform: booleanAttribute }) sticky?: boolean
  @Input() opacity?: number
  @Input() className?: string
  @Input({ transform: booleanAttribute }) interactive?: boolean

  private off: (() => void) | null = null
  private boundTo: L.Layer | null = null
  private tooltip: L.Tooltip | null = null

  buildOptions(): L.TooltipOptions {
    return defined({
      offset: this.offset,
      direction: this.direction,
      permanent: this.permanent,
      sticky: this.sticky,
      opacity: this.opacity,
      className: this.className,
      interactive: this.interactive,
    } as L.TooltipOptions)
  }

  ngAfterViewInit(): void {
    if (this.parent) {
      this.off = this.parent.whenLayer((layer) => {
        this.boundTo = layer
        layer.bindTooltip(this.takeContent(), this.buildOptions())
      })
    } else if (this.lngLat && this.mapHost) {
      const lngLat = this.lngLat
      this.off = this.mapHost.whenMap((map, Lmod) => {
        this.tooltip = Lmod.tooltip(this.buildOptions()).setLatLng(toLatLng(lngLat)).setContent(this.takeContent())
        this.tooltip.addTo(map)
      })
    }
  }

  /** Moves the projected nodes into a `.uipkge-leaflet-tooltip-src` node (React portals there). */
  private takeContent(): HTMLElement {
    const el = document.createElement('div')
    el.className = 'uipkge-leaflet-tooltip-src'
    for (const n of [...(this.hostEl?.nativeElement?.childNodes ?? [])]) el.appendChild(n)
    return el
  }

  ngOnDestroy(): void {
    this.off?.()
    this.off = null
    try {
      this.boundTo?.unbindTooltip()
      this.tooltip?.remove()
    } catch {
      /* map already destroyed */
    }
    this.boundTo = null
    this.tooltip = null
  }
}

/** Shared path inputs (React's LeafletPathProps). */
@Directive()
abstract class LeafletPathHost<T extends L.Path> extends LeafletLayerHost<T> implements OnChanges {
  @Input() color?: string
  @Input() weight?: number
  @Input() opacity?: number
  @Input() lineCap?: 'butt' | 'round' | 'square'
  @Input() lineJoin?: 'miter' | 'round' | 'bevel'
  @Input() dashArray?: string | number[]
  @Input() dashOffset?: string
  @Input() fill?: boolean
  @Input() fillColor?: string
  @Input() fillOpacity?: number
  @Input() className?: string
  /** React `onClick` / Vue `click` on the path. */
  @Output() layerClick = new EventEmitter<L.LeafletMouseEvent>()

  protected override onLayerAdded(layer: T): void {
    layer.on('click', (ev: L.LeafletMouseEvent) => this.layerClick.emit(ev))
  }

  protected pathOptions(): L.PathOptions {
    return defined({
      color: this.color,
      weight: this.weight,
      opacity: this.opacity,
      lineCap: this.lineCap,
      lineJoin: this.lineJoin,
      dashArray: this.dashArray,
      dashOffset: this.dashOffset,
      fill: this.fill,
      fillColor: this.fillColor,
      fillOpacity: this.fillOpacity,
      className: this.className,
      interactive: true,
    } as L.PathOptions)
  }

  /** Geometry updates (lngLatPath / center / radius); styles are handled here. */
  protected abstract updateGeometry(layer: T, changes: SimpleChanges): void

  ngOnChanges(changes: SimpleChanges): void {
    const layer = this.layer
    if (!layer) return
    this.updateGeometry(layer, changes)
    const styleKeys = [
      'color',
      'weight',
      'opacity',
      'lineCap',
      'lineJoin',
      'dashArray',
      'dashOffset',
      'fill',
      'fillColor',
      'fillOpacity',
    ]
    if (styleKeys.some((k) => changes[k])) layer.setStyle(this.pathOptions())
  }
}

/** Polyline through `[lng, lat][]` (or `[][]` for multi-part lines). */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-leaflet-polyline, [ui-leaflet-polyline]',
  standalone: true,
  providers: [{ provide: LeafletLayerHost, useExisting: forwardRef(() => UiLeafletPolylineComponent) }],
  template: `<ng-content />`,
})
export class UiLeafletPolylineComponent extends LeafletPathHost<L.Polyline> {
  @Input() lngLatPath: [number, number][] | [number, number][][] = []
  @Input() smoothFactor?: number
  @Input({ transform: booleanAttribute }) noClip?: boolean

  buildOptions(): L.PolylineOptions {
    return defined({ ...this.pathOptions(), smoothFactor: this.smoothFactor, noClip: this.noClip } as L.PolylineOptions)
  }

  protected build(Lmod: LeafletModule): L.Polyline {
    return Lmod.polyline(toLatLngs(this.lngLatPath) as L.LatLngExpression[], this.buildOptions())
  }

  protected updateGeometry(layer: L.Polyline, changes: SimpleChanges): void {
    if (changes['lngLatPath']) layer.setLatLngs(toLatLngs(this.lngLatPath) as L.LatLngExpression[])
  }
}

/** Polygon ring(s) as `[lng, lat][]` (or `[][]` for holes/multi). */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-leaflet-polygon, [ui-leaflet-polygon]',
  standalone: true,
  providers: [{ provide: LeafletLayerHost, useExisting: forwardRef(() => UiLeafletPolygonComponent) }],
  template: `<ng-content />`,
})
export class UiLeafletPolygonComponent extends LeafletPathHost<L.Polygon> {
  @Input() lngLatPath: [number, number][] | [number, number][][] = []

  buildOptions(): L.PolylineOptions {
    return this.pathOptions() as L.PolylineOptions
  }

  protected build(Lmod: LeafletModule): L.Polygon {
    return Lmod.polygon(toLatLngs(this.lngLatPath) as L.LatLngExpression[], this.buildOptions())
  }

  protected updateGeometry(layer: L.Polygon, changes: SimpleChanges): void {
    if (changes['lngLatPath']) layer.setLatLngs(toLatLngs(this.lngLatPath) as L.LatLngExpression[])
  }
}

/** Circle at `[lng, lat]` with a radius in meters. */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-leaflet-circle, [ui-leaflet-circle]',
  standalone: true,
  providers: [{ provide: LeafletLayerHost, useExisting: forwardRef(() => UiLeafletCircleComponent) }],
  template: `<ng-content />`,
})
export class UiLeafletCircleComponent extends LeafletPathHost<L.Circle> {
  /** [lng, lat] — Mapbox order. */
  @Input() center: [number, number] = [0, 0]
  /** Radius in meters. */
  @Input() radius?: number

  buildOptions(): L.CircleMarkerOptions {
    return this.pathOptions() as L.CircleMarkerOptions
  }

  protected build(Lmod: LeafletModule): L.Circle {
    return Lmod.circle(
      toLatLng(this.center),
      defined({ ...this.buildOptions(), radius: this.radius }) as L.CircleOptions,
    )
  }

  protected updateGeometry(layer: L.Circle, changes: SimpleChanges): void {
    if (changes['center'] && this.center) layer.setLatLng(toLatLng(this.center))
    if (changes['radius'] && this.radius !== undefined) layer.setRadius(this.radius)
  }
}

/** CircleMarker at `[lng, lat]` with a radius in pixels (stays the same size at any zoom). */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-leaflet-circle-marker, [ui-leaflet-circle-marker]',
  standalone: true,
  providers: [{ provide: LeafletLayerHost, useExisting: forwardRef(() => UiLeafletCircleMarkerComponent) }],
  template: `<ng-content />`,
})
export class UiLeafletCircleMarkerComponent extends LeafletPathHost<L.CircleMarker> {
  /** [lng, lat] — Mapbox order. */
  @Input() center: [number, number] = [0, 0]
  /** Radius in pixels. */
  @Input() radius?: number

  buildOptions(): L.CircleMarkerOptions {
    return this.pathOptions() as L.CircleMarkerOptions
  }

  protected build(Lmod: LeafletModule): L.CircleMarker {
    return Lmod.circleMarker(
      toLatLng(this.center),
      defined({ ...this.buildOptions(), radius: this.radius }) as L.CircleMarkerOptions,
    )
  }

  protected updateGeometry(layer: L.CircleMarker, changes: SimpleChanges): void {
    if (changes['center'] && this.center) layer.setLatLng(toLatLng(this.center))
    if (changes['radius'] && this.radius !== undefined) layer.setRadius(this.radius)
  }
}

/** GeoJSON overlay: FeatureCollection / Feature / geometry with Leaflet GeoJSON options. */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-leaflet-geojson, [ui-leaflet-geojson]',
  standalone: true,
  providers: [{ provide: LeafletLayerHost, useExisting: forwardRef(() => UiLeafletGeoJsonComponent) }],
  template: `<ng-content />`,
})
export class UiLeafletGeoJsonComponent extends LeafletLayerHost<L.GeoJSON> implements OnChanges {
  /** GeoJSON FeatureCollection / Feature / geometry. */
  @Input() geojson!: GeoJSON.GeoJSON
  /** Leaflet GeoJSON options: `style`, `pointToLayer`, `onEachFeature`, `filter`, `coordsToLatLng`. */
  @Input() options?: L.GeoJSONOptions
  /** React `onClick` / Vue `click` on a GeoJSON feature. */
  @Output() layerClick = new EventEmitter<L.LeafletMouseEvent>()

  protected build(Lmod: LeafletModule): L.GeoJSON {
    return Lmod.geoJSON(this.geojson as GeoJSON.GeoJSON, this.options)
  }

  protected override onLayerAdded(layer: L.GeoJSON): void {
    layer.on('click', (ev: L.LeafletMouseEvent) => this.layerClick.emit(ev))
  }

  ngOnChanges(changes: SimpleChanges): void {
    const layer = this.layer
    if (!layer || !this.geojson) return
    if (changes['geojson']) {
      layer.clearLayers()
      layer.addData(this.geojson as GeoJSON.GeoJSON)
    }
  }
}

/** Extra raster tile layer composited onto the map. */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-leaflet-tile-layer, [ui-leaflet-tile-layer]',
  standalone: true,
  template: ``,
})
export class UiLeafletTileLayerComponent extends LeafletLayerHost<L.TileLayer> implements OnChanges {
  /** Raster tile URL template ({z}/{x}/{y}, optional {s} subdomains + {r} retina). */
  @Input() url!: string
  @Input() attribution?: string
  @Input() subdomains?: string | string[]
  @Input() minZoom?: number
  @Input() maxZoom?: number
  @Input() opacity?: number
  @Input() zIndex?: number
  @Input({ transform: booleanAttribute }) tms?: boolean

  buildOptions(): L.TileLayerOptions {
    return defined({
      attribution: this.attribution,
      subdomains: this.subdomains,
      minZoom: this.minZoom,
      maxZoom: this.maxZoom,
      opacity: this.opacity,
      zIndex: this.zIndex,
      tms: this.tms,
    })
  }

  protected build(Lmod: LeafletModule): L.TileLayer {
    return Lmod.tileLayer(this.url, this.buildOptions())
  }

  ngOnChanges(changes: SimpleChanges): void {
    const layer = this.layer
    if (!layer) return
    if (changes['url'] && this.url) layer.setUrl(this.url)
    if (changes['opacity'] && this.opacity !== undefined) layer.setOpacity(this.opacity)
    if (changes['zIndex'] && this.zIndex !== undefined) layer.setZIndex(this.zIndex)
  }
}
