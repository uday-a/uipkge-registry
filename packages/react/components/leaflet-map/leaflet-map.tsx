'use client'

import * as React from 'react'
import { createPortal } from 'react-dom'
import type * as L from 'leaflet'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'
import {
  leafletMapVariants,
  LEAFLET_TILES,
  LEAFLET_THEME_TILES,
  type LeafletMapVariant,
  type LeafletMapVariants,
  type LeafletTilePreset,
} from './leaflet-map.variants'
import 'leaflet/dist/leaflet.css'
import './leaflet-map.css'

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
function fixDefaultLeafletIcon(L: LeafletModule) {
  if (defaultIconFixed) return
  defaultIconFixed = true
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: `${LEAFLET_ICON_BASE}/marker-icon-2x.png`,
    iconUrl: `${LEAFLET_ICON_BASE}/marker-icon.png`,
    shadowUrl: `${LEAFLET_ICON_BASE}/marker-shadow.png`,
  })
}

const LeafletMapContext = React.createContext<L.Map | null>(null)
const LeafletLayerContext = React.createContext<L.Layer | null>(null)

/** The L.Map instance from the enclosing <LeafletMap> — null until created. */
export function useLeafletMap() {
  return React.useContext(LeafletMapContext)
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

/** Imperative handle published by <LeafletMap> — mirrors the `map`
 *  component's MapRef surface: camera helpers plus the raw L.Map. */
export interface LeafletMapRef {
  readonly map: L.Map | null
  getMap(): L.Map | null
  flyTo(options?: LeafletFlyToOptions): void
  setView(options?: LeafletViewOptions): void
  jumpTo(options?: LeafletViewOptions): void
  fitBounds(bounds: [[number, number], [number, number]] | L.LatLngBoundsExpression, options?: L.FitBoundsOptions): void
  panTo(center: [number, number]): void
  zoomIn(): void
  zoomOut(): void
  resize(): void
}

export interface LeafletMapProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Named raster basemap preset ('streets' | 'outdoors' | 'satellite' | 'satellite-streets' | 'light' | 'dark' | 'navigation-day' | 'navigation-night' | 'standard' | 'muted' | 'default'). */
  variant?: LeafletMapVariant
  /** Height preset. Omit to size via `className` (blocks typically pass `size-full`). */
  size?: LeafletMapVariants['size']
  /** Custom raster tile URL template — overrides `variant`. */
  tileUrl?: string
  /** Attribution HTML for a custom `tileUrl`. Defaults to the OpenStreetMap credit. */
  tileAttribution?: string
  /** Tile subdomains for a custom `tileUrl` ('abcd' or ['a','b']). */
  tileSubdomains?: string | string[]
  /** Initial [lng, lat] — Mapbox order, matching the `map` component. */
  center?: [number, number]
  zoom?: number
  minZoom?: number
  /** Caps the map's max zoom. Defaults to the tile provider's own maxZoom. */
  maxZoom?: number
  /** Show the zoom control. */
  navigation?: boolean
  /** Placement of the zoom control ('top-left' | 'top-right' | 'bottom-left' | 'bottom-right'). */
  navigationPosition?: LeafletPosition
  /** Show the HTML5 fullscreen toggle button. */
  fullscreen?: boolean
  /** Placement of the fullscreen button. Defaults to 'top-right'. */
  fullscreenPosition?: LeafletPosition
  /** Show tile credits behind a ⓘ button (reveals on hover/tap). Keep on — OSM/Esri tiles require attribution. */
  attribution?: boolean
  /** Wheel zoom. Set false for maps embedded in scrollable pages. */
  scrollWheelZoom?: boolean
  /** Desaturate the tile pane to a quiet canvas (markers stay coloured). */
  muted?: boolean
  /** Hands you the raw Leaflet Map once it is created. */
  onCreated?: (map: L.Map) => void
}

const LeafletMapComponent = React.forwardRef<LeafletMapRef, LeafletMapProps>(
  (
    {
      className,
      variant = 'default',
      size,
      tileUrl,
      tileAttribution,
      tileSubdomains,
      center = [0, 20],
      zoom = 2,
      minZoom,
      maxZoom,
      navigation = true,
      navigationPosition = 'bottom-right',
      fullscreen = false,
      fullscreenPosition = 'top-right',
      attribution = true,
      scrollWheelZoom = true,
      muted = false,
      onCreated,
      children,
      ...props
    },
    ref,
  ) => {
    const { resolvedTheme } = useTheme()
    const [htmlDark, setHtmlDark] = React.useState(false)
    const isDark = resolvedTheme === 'dark' || htmlDark
    const isMuted = muted || variant === 'muted'

    const resolvedTiles = React.useMemo<LeafletTilePreset>(() => {
      if (tileUrl) {
        return {
          url: tileUrl,
          attribution:
            tileAttribution ??
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          subdomains: tileSubdomains,
          maxZoom,
        }
      }
      if (
        variant &&
        variant !== 'default' &&
        variant !== 'muted' &&
        LEAFLET_TILES[variant as keyof typeof LEAFLET_TILES]
      ) {
        return LEAFLET_TILES[variant as keyof typeof LEAFLET_TILES]
      }
      return isDark ? LEAFLET_THEME_TILES.dark : LEAFLET_THEME_TILES.light
    }, [tileUrl, tileAttribution, tileSubdomains, maxZoom, variant, isDark])

    const [mounted, setMounted] = React.useState(false)
    const [inView, setInView] = React.useState(false)
    const [isFullscreen, setIsFullscreen] = React.useState(false)
    const [canZoomIn, setCanZoomIn] = React.useState(true)
    const [canZoomOut, setCanZoomOut] = React.useState(true)
    const containerRef = React.useRef<HTMLDivElement>(null)
    const mapElRef = React.useRef<HTMLDivElement>(null)
    const mapRef = React.useRef<L.Map | null>(null)
    const leafletRef = React.useRef<LeafletModule | null>(null)
    const baseLayerRef = React.useRef<L.TileLayer | null>(null)
    const overlayLayerRef = React.useRef<L.TileLayer | null>(null)
    const [mapReady, setMapReady] = React.useState(false)
    const [attributions, setAttributions] = React.useState<string[]>([])
    const [showAttribution, setShowAttribution] = React.useState(false)

    const syncZoomBounds = React.useCallback(() => {
      const m = mapRef.current
      if (!m) return
      setCanZoomIn(m.getZoom() < m.getMaxZoom())
      setCanZoomOut(m.getZoom() > m.getMinZoom())
    }, [])

    // Collect attribution strings from every layer (base tiles, overlays,
    // custom LeafletTileLayers) — deduped, rendered by the ⓘ popover.
    const collectAttributions = React.useCallback(() => {
      const m = mapRef.current
      if (!m) return
      const seen = new Set<string>()
      m.eachLayer((layer) => {
        const a = (layer as L.TileLayer).options?.attribution
        if (typeof a === 'string' && a) seen.add(a)
      })
      setAttributions([...seen])
    }, [])

    const applyTiles = React.useCallback((tiles: LeafletTilePreset) => {
      const m = mapRef.current
      const L = leafletRef.current
      if (!m || !L) return
      baseLayerRef.current?.remove()
      baseLayerRef.current = null
      overlayLayerRef.current?.remove()
      overlayLayerRef.current = null
      baseLayerRef.current = L.tileLayer(
        tiles.url,
        defined({
          attribution: tiles.attribution,
          subdomains: tiles.subdomains,
          maxZoom: tiles.maxZoom ?? 19,
        }),
      )
      baseLayerRef.current.addTo(m)
      if (tiles.overlayUrl) {
        overlayLayerRef.current = L.tileLayer(tiles.overlayUrl, { maxZoom: tiles.maxZoom ?? 19 })
        overlayLayerRef.current.addTo(m)
      }
    }, [])

    React.useEffect(() => {
      const root = document.documentElement
      const sync = () => setHtmlDark(root.classList.contains('dark'))
      sync()
      setMounted(true)
      const obs = new MutationObserver(sync)
      obs.observe(root, { attributes: true, attributeFilter: ['class'] })
      const onFs = () => setIsFullscreen(Boolean(document.fullscreenElement))
      document.addEventListener('fullscreenchange', onFs)
      return () => {
        obs.disconnect()
        document.removeEventListener('fullscreenchange', onFs)
      }
    }, [])

    React.useEffect(() => {
      const el = containerRef.current
      if (!el || typeof IntersectionObserver === 'undefined') {
        setInView(true)
        return
      }
      const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
        rootMargin: '160px',
        threshold: 0.01,
      })
      io.observe(el)
      return () => io.disconnect()
    }, [])

    React.useEffect(() => {
      const el = containerRef.current
      if (!el || typeof ResizeObserver === 'undefined') return
      const ro = new ResizeObserver(() => mapRef.current?.invalidateSize())
      ro.observe(el)
      return () => ro.disconnect()
    }, [mounted])

    React.useEffect(() => {
      if (!mounted || !inView || mapRef.current) return
      let cancelled = false
      loadLeaflet().then((L) => {
        if (cancelled || mapRef.current || !mapElRef.current) return
        leafletRef.current = L
        fixDefaultLeafletIcon(L)
        const tiles = resolvedTiles
        const m = L.map(
          mapElRef.current,
          defined({
            center: toLatLng(center),
            zoom,
            minZoom,
            maxZoom: maxZoom ?? tiles.maxZoom,
            zoomControl: false,
            attributionControl: false,
            scrollWheelZoom,
          }),
        )
        mapRef.current = m
        applyTiles(tiles)
        m.on('zoomend', syncZoomBounds)
        syncZoomBounds()
        m.on('layeradd layerremove', collectAttributions)
        collectAttributions()
        setMapReady(true)
        onCreated?.(m)
      })
      return () => {
        cancelled = true
      }
      // Map creation is mount-once; later prop changes flow through the
      // watchers below.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mounted, inView])

    React.useEffect(() => {
      if (mapRef.current) applyTiles(resolvedTiles)
    }, [resolvedTiles, applyTiles])

    React.useEffect(() => {
      const m = mapRef.current
      if (m && center) m.setView(toLatLng(center), zoom)
    }, [center, zoom])

    React.useEffect(() => {
      if (!attribution) setShowAttribution(false)
    }, [attribution])

    React.useEffect(() => {
      const m = mapRef.current
      if (!m) return
      if (scrollWheelZoom) m.scrollWheelZoom.enable()
      else m.scrollWheelZoom.disable()
    }, [scrollWheelZoom])

    React.useEffect(
      () => () => {
        mapRef.current?.remove()
        mapRef.current = null
      },
      [],
    )

    React.useImperativeHandle(
      ref,
      () => ({
        get map() {
          return mapRef.current
        },
        getMap: () => mapRef.current,
        flyTo: (options = {}) => {
          const m = mapRef.current
          if (!m) return
          m.flyTo(options.center ? toLatLng(options.center) : m.getCenter(), options.zoom ?? m.getZoom(), {
            duration: (options.duration ?? 800) / 1000,
          })
        },
        setView: (options = {}) => {
          const m = mapRef.current
          if (!m) return
          m.setView(options.center ? toLatLng(options.center) : m.getCenter(), options.zoom ?? m.getZoom())
        },
        jumpTo: (options = {}) => {
          const m = mapRef.current
          if (!m) return
          m.setView(options.center ? toLatLng(options.center) : m.getCenter(), options.zoom ?? m.getZoom(), {
            animate: false,
          })
        },
        fitBounds: (bounds, options) =>
          mapRef.current?.fitBounds(toLatLngBounds(bounds as [[number, number], [number, number]]), options),
        panTo: (c) => mapRef.current?.panTo(toLatLng(c)),
        zoomIn: () => mapRef.current?.zoomIn(),
        zoomOut: () => mapRef.current?.zoomOut(),
        resize: () => mapRef.current?.invalidateSize(),
      }),
      [mapReady],
    )

    // Zoom/fullscreen chrome is plain HTML overlaid on the map (like Mapbox's
    // controls) — a corner stack per occupied corner, zoom group above fullscreen.
    const cornerClasses: Record<LeafletPosition, string> = {
      'top-left': 'left-3 top-3',
      'top-right': 'right-3 top-3',
      // above the ⓘ button (bottom-left) when credits are shown
      'bottom-left': attribution && attributions.length ? 'bottom-9 left-3' : 'bottom-3 left-3',
      'bottom-right': 'bottom-3 right-3',
    }
    const cornerOrder: LeafletPosition[] = ['top-left', 'top-right', 'bottom-left', 'bottom-right']
    const navPosition = navigationPosition ?? 'bottom-right'
    const fsPosition = fullscreenPosition ?? 'top-right'

    return (
      <div
        ref={containerRef}
        data-uipkge=""
        data-slot="leaflet-map"
        data-variant={variant}
        data-muted={isMuted}
        className={cn(leafletMapVariants({ variant, ...(size ? { size } : {}) }), className)}
        {...props}
      >
        {/* className must stay constant — React rewrites the attribute when
            the value changes and would wipe the classes Leaflet adds
            (leaflet-container, leaflet-touch, …). The empty pre-mount div is
            invisible regardless. */}
        <div ref={mapElRef} className="size-full" />
        {cornerOrder.map((corner) => {
          const showZoom = mapReady && navigation && navPosition === corner
          const showFullscreen = mapReady && fullscreen && fsPosition === corner
          if (!showZoom && !showFullscreen) return null
          return (
            <div key={corner} className={cn('absolute z-[1000] flex flex-col gap-2.5', cornerClasses[corner])}>
              {showZoom && (
                <div className="border-border bg-card divide-border flex flex-col divide-y overflow-hidden rounded-lg border shadow-sm">
                  <button
                    type="button"
                    className="text-muted-foreground hover:bg-muted flex size-8 items-center justify-center transition-colors disabled:pointer-events-none disabled:opacity-40"
                    aria-label="Zoom in"
                    disabled={!canZoomIn}
                    onClick={() => mapRef.current?.zoomIn()}
                  >
                    <svg className="size-full" viewBox="0 0 29 29" fill="currentColor" aria-hidden="true">
                      <path d="M14.5 8.5c-.75 0-1.5.75-1.5 1.5v3h-3c-.75 0-1.5.75-1.5 1.5S9.25 16 10 16h3v3c0 .75.75 1.5 1.5 1.5S16 19.75 16 19v-3h3c.75 0 1.5-.75 1.5-1.5S19.75 13 19 13h-3v-3c0-.75-.75-1.5-1.5-1.5z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="text-muted-foreground hover:bg-muted flex size-8 items-center justify-center transition-colors disabled:pointer-events-none disabled:opacity-40"
                    aria-label="Zoom out"
                    disabled={!canZoomOut}
                    onClick={() => mapRef.current?.zoomOut()}
                  >
                    <svg className="size-full" viewBox="0 0 29 29" fill="currentColor" aria-hidden="true">
                      <path d="M10 13c-.75 0-1.5.75-1.5 1.5S9.25 16 10 16h9c.75 0 1.5-.75 1.5-1.5S19.75 13 19 13h-9z" />
                    </svg>
                  </button>
                </div>
              )}
              {showFullscreen && (
                <button
                  type="button"
                  className="border-border bg-card text-muted-foreground hover:bg-muted flex size-8 items-center justify-center rounded-lg border shadow-sm transition-colors"
                  aria-label="Toggle fullscreen"
                  onClick={() => {
                    const el = containerRef.current
                    if (!el) return
                    if (document.fullscreenElement) document.exitFullscreen()
                    else el.requestFullscreen?.()
                  }}
                >
                  <svg className="size-full" viewBox="0 0 29 29" fill="currentColor" aria-hidden="true">
                    {isFullscreen ? (
                      <path d="M18.5 16c-1.75 0-2.5.75-2.5 2.5V24h1l1.5-3 5.5 4 1-1-4-5.5 3-1.5v-1h-5.5zM13 18.5c0-1.75-.75-2.5-2.5-2.5H5v1l3 1.5L4 24l1 1 5.5-4 1.5 3h1v-5.5zm3-8c0 1.75.75 2.5 2.5 2.5H24v-1l-3-1.5L25 5l-1-1-5.5 4L17 5h-1v5.5zM10.5 13c1.75 0 2.5-.75 2.5-2.5V5h-1l-1.5 3L5 4 4 5l4 5.5L5 12v1h5.5z" />
                    ) : (
                      <path d="M24 16v5.5c0 1.75-.75 2.5-2.5 2.5H16v-1l3-1.5-4-5.5 1-1 5.5 4 1.5-3h1zM6 16l1.5 3 5.5-4 1 1-4 5.5 3 1.5v1H7.5C5.75 24 5 23.25 5 21.5V16h1zm7-11v1l-3 1.5 4 5.5-1 1-5.5-4L6 13H5V7.5C5 5.75 5.75 5 7.5 5H13zm11 2.5c0-1.75-.75-2.5-2.5-2.5H16v1l3 1.5-4 5.5 1 1 5.5-4 1.5 3h1V7.5z" />
                    )}
                  </svg>
                </button>
              )}
            </div>
          )
        })}
        {/* Tile credits behind a Mapbox-style ⓘ button: hover reveals on
            desktop, tap toggles on touch. Keep visible — OSM/Esri tiles
            require credit. */}
        {mapReady && attribution && attributions.length > 0 && (
          <div className="group absolute bottom-3 left-3 z-[1000] flex flex-col items-start gap-1.5">
            <div
              role="note"
              className={cn(
                'border-border bg-popover text-popover-foreground max-w-64 rounded-md border px-2.5 py-1.5 text-[11px] leading-relaxed shadow-md transition-opacity [&_a]:underline',
                showAttribution
                  ? 'visible opacity-100'
                  : 'invisible opacity-0 group-hover:visible group-hover:opacity-100',
              )}
              dangerouslySetInnerHTML={{ __html: attributions.join(' | ') }}
            />
            <button
              type="button"
              className="border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground flex size-4 items-center justify-center rounded-full border shadow-xs transition-colors"
              aria-label="Map data attribution"
              aria-expanded={showAttribution}
              onClick={() => setShowAttribution((v) => !v)}
            >
              <svg
                className="size-3"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4M12 8h.01" />
              </svg>
            </button>
          </div>
        )}
        {mapReady && <LeafletMapContext.Provider value={mapRef.current}>{children}</LeafletMapContext.Provider>}
      </div>
    )
  },
)
LeafletMapComponent.displayName = 'LeafletMap'

/** Shared layer lifecycle: build once the enclosing map exists, add to it,
 *  remove on unmount, and republish through LeafletLayerContext so nested
 *  popups/tooltips can bind. */
function useLeafletLayer<T extends L.Layer>(build: (L: LeafletModule) => T): T | null {
  const map = useLeafletMap()
  const [layer, setLayer] = React.useState<T | null>(null)
  const buildRef = React.useRef(build)
  buildRef.current = build
  React.useEffect(() => {
    if (!map) return
    let cancelled = false
    let instance: T | null = null
    loadLeaflet().then((L) => {
      if (cancelled) return
      instance = buildRef.current(L)
      instance.addTo(map)
      setLayer(instance)
    })
    return () => {
      cancelled = true
      instance?.remove()
      setLayer(null)
    }
  }, [map])
  return layer
}

function useLatest<T>(value: T) {
  const r = React.useRef(value)
  r.current = value
  return r
}

type MarkerAnchor =
  'center' | 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

export interface LeafletMarkerProps {
  /** [lng, lat] — Mapbox order, matching the `map` component's MapMarker. */
  lngLat: [number, number]
  /** Which edge/corner of the marker content sits on the coordinate. */
  anchor?: MarkerAnchor
  draggable?: boolean
  opacity?: number
  zIndexOffset?: number
  title?: string
  alt?: string
  onClick?: (e: L.LeafletMouseEvent) => void
  children?: React.ReactNode
}

/** Marker with real-DOM custom content: children portal into a div icon, so
 *  event handlers and state keep working. LeafletPopup/LeafletTooltip children
 *  bind to the marker instead of becoming icon content. */
const LeafletMarkerComponent = ({
  lngLat,
  anchor = 'center',
  draggable,
  opacity,
  zIndexOffset,
  title,
  alt,
  onClick,
  children,
}: LeafletMarkerProps) => {
  const map = useLeafletMap()
  const [iconEl, setIconEl] = React.useState<HTMLElement | null>(null)
  const [marker, setMarker] = React.useState<L.Marker | null>(null)
  const onClickRef = useLatest(onClick)

  const kids = React.Children.toArray(children)
  const overlays = kids.filter(
    (k) => React.isValidElement(k) && (k.type === LeafletPopupComponent || k.type === LeafletTooltipComponent),
  )
  const htmlKids = kids.filter((k) => !overlays.includes(k))
  const hasHtml = htmlKids.length > 0
  const hasHtmlRef = useLatest(hasHtml)

  React.useEffect(() => {
    if (!map) return
    let cancelled = false
    let m: L.Marker | null = null
    loadLeaflet().then((L) => {
      if (cancelled) return
      let el: HTMLElement | undefined
      if (hasHtmlRef.current) {
        el = document.createElement('div')
        el.className = 'uipkge-leaflet-anchor'
        el.dataset.anchor = anchor
      }
      m = L.marker(
        toLatLng(lngLat),
        defined({
          icon: el ? L.divIcon({ className: 'uipkge-leaflet-div-icon', html: el }) : undefined,
          interactive: true,
          draggable,
          opacity,
          zIndexOffset,
          title,
          alt,
        }),
      )
      m.on('click', (ev) => onClickRef.current?.(ev))
      m.addTo(map)
      setMarker(m)
      if (el) setIconEl(el)
    })
    return () => {
      cancelled = true
      m?.remove()
      setMarker(null)
      setIconEl(null)
    }
    // Marker builds once per map; prop changes flow through the effects below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map])

  React.useEffect(() => {
    marker?.setLatLng(toLatLng(lngLat))
  }, [marker, lngLat?.[0], lngLat?.[1]])
  React.useEffect(() => {
    if (opacity !== undefined) marker?.setOpacity(opacity)
  }, [marker, opacity])
  React.useEffect(() => {
    if (zIndexOffset !== undefined) marker?.setZIndexOffset(zIndexOffset)
  }, [marker, zIndexOffset])

  return (
    <LeafletLayerContext.Provider value={marker}>
      {overlays}
      {iconEl ? createPortal(htmlKids, iconEl) : null}
    </LeafletLayerContext.Provider>
  )
}
LeafletMarkerComponent.displayName = 'LeafletMarker'

export interface LeafletPopupProps {
  /** [lng, lat] — standalone popup on the map. Omit inside a layer to bind to it. */
  lngLat?: [number, number]
  maxWidth?: number
  /** Minimum popup width. Defaults to 200 — keeps card-style content from collapsing narrow. */
  minWidth?: number
  offset?: [number, number]
  className?: string
  autoClose?: boolean
  closeOnClick?: boolean
  closeButton?: boolean
  keepInView?: boolean
  children?: React.ReactNode
}

/** Popup bound to the nearest ancestor layer, or opened standalone at `lngLat`.
 *  Children portal into the popup's real content node. */
const LeafletPopupComponent = ({ lngLat, minWidth = 200, children, ...options }: LeafletPopupProps) => {
  const map = useLeafletMap()
  const parent = React.useContext(LeafletLayerContext)
  const [contentEl, setContentEl] = React.useState<HTMLElement | null>(null)
  const optionsRef = useLatest(defined({ ...options, minWidth }))

  React.useEffect(() => {
    if (!map) return
    const el = document.createElement('div')
    el.className = 'uipkge-leaflet-popup-src'
    setContentEl(el)
    let cancelled = false
    let popup: L.Popup | null = null
    let boundTo: L.Layer | null = null
    loadLeaflet().then((L) => {
      if (cancelled) return
      if (parent) {
        boundTo = parent
        parent.bindPopup(el, optionsRef.current as L.PopupOptions)
      } else if (lngLat) {
        popup = L.popup(optionsRef.current as L.PopupOptions)
          .setLatLng(toLatLng(lngLat))
          .setContent(el)
        popup.openOn(map)
      }
    })
    return () => {
      cancelled = true
      try {
        boundTo?.unbindPopup()
        popup?.remove()
      } catch {
        /* map already destroyed */
      }
      setContentEl(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, parent])

  return contentEl ? createPortal(children, contentEl) : null
}
LeafletPopupComponent.displayName = 'LeafletPopup'

export interface LeafletTooltipProps {
  /** [lng, lat] — standalone tooltip on the map. Omit inside a layer to bind to it. */
  lngLat?: [number, number]
  offset?: [number, number]
  direction?: 'top' | 'bottom' | 'left' | 'right' | 'center' | 'auto'
  permanent?: boolean
  sticky?: boolean
  opacity?: number
  className?: string
  interactive?: boolean
  children?: React.ReactNode
}

/** Tooltip bound to the nearest ancestor layer, or standalone at `lngLat`. */
const LeafletTooltipComponent = ({ lngLat, children, ...options }: LeafletTooltipProps) => {
  const map = useLeafletMap()
  const parent = React.useContext(LeafletLayerContext)
  const [contentEl, setContentEl] = React.useState<HTMLElement | null>(null)
  const optionsRef = useLatest(options)

  React.useEffect(() => {
    if (!map) return
    const el = document.createElement('div')
    el.className = 'uipkge-leaflet-tooltip-src'
    setContentEl(el)
    let cancelled = false
    let tooltip: L.Tooltip | null = null
    let boundTo: L.Layer | null = null
    loadLeaflet().then((L) => {
      if (cancelled) return
      if (parent) {
        boundTo = parent
        parent.bindTooltip(el, optionsRef.current as L.TooltipOptions)
      } else if (lngLat) {
        tooltip = L.tooltip(optionsRef.current as L.TooltipOptions)
          .setLatLng(toLatLng(lngLat))
          .setContent(el)
        tooltip.addTo(map)
      }
    })
    return () => {
      cancelled = true
      try {
        boundTo?.unbindTooltip()
        tooltip?.remove()
      } catch {
        /* map already destroyed */
      }
      setContentEl(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, parent])

  return contentEl ? createPortal(children, contentEl) : null
}
LeafletTooltipComponent.displayName = 'LeafletTooltip'

export interface LeafletPathProps {
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
  className?: string
  onClick?: (e: L.LeafletMouseEvent) => void
  children?: React.ReactNode
}

export interface LeafletPolylineProps extends LeafletPathProps {
  /** Path points as [lng, lat][] — or [lng, lat][][] for multi-part lines. */
  lngLatPath: [number, number][] | [number, number][][]
  smoothFactor?: number
  noClip?: boolean
}

const LeafletPolylineComponent = ({ lngLatPath, onClick, children, ...opts }: LeafletPolylineProps) => {
  const onClickRef = useLatest(onClick)
  const optsRef = useLatest(opts)
  const layer = useLeafletLayer<L.Polyline>((L) => {
    const l = L.polyline(toLatLngs(lngLatPath) as L.LatLngExpression[], { ...optsRef.current, interactive: true })
    l.on('click', (ev) => onClickRef.current?.(ev))
    return l
  })
  React.useEffect(() => {
    layer?.setLatLngs(toLatLngs(lngLatPath) as L.LatLngExpression[])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layer, lngLatPath])
  React.useEffect(() => {
    layer?.setStyle({ ...opts, interactive: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layer, opts.color, opts.weight, opts.opacity, opts.dashArray, opts.dashOffset, opts.lineCap, opts.lineJoin])
  return <LeafletLayerContext.Provider value={layer}>{children}</LeafletLayerContext.Provider>
}
LeafletPolylineComponent.displayName = 'LeafletPolyline'

export interface LeafletPolygonProps extends LeafletPathProps {
  /** Ring points as [lng, lat][] — or [lng, lat][][] for holes/multi-polygons. */
  lngLatPath: [number, number][] | [number, number][][]
}

const LeafletPolygonComponent = ({ lngLatPath, onClick, children, ...opts }: LeafletPolygonProps) => {
  const onClickRef = useLatest(onClick)
  const optsRef = useLatest(opts)
  const layer = useLeafletLayer<L.Polygon>((L) => {
    const l = L.polygon(toLatLngs(lngLatPath) as L.LatLngExpression[], { ...optsRef.current, interactive: true })
    l.on('click', (ev) => onClickRef.current?.(ev))
    return l
  })
  React.useEffect(() => {
    layer?.setLatLngs(toLatLngs(lngLatPath) as L.LatLngExpression[])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layer, lngLatPath])
  React.useEffect(() => {
    layer?.setStyle({ ...opts, interactive: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layer, opts.color, opts.weight, opts.opacity, opts.fill, opts.fillColor, opts.fillOpacity, opts.dashArray])
  return <LeafletLayerContext.Provider value={layer}>{children}</LeafletLayerContext.Provider>
}
LeafletPolygonComponent.displayName = 'LeafletPolygon'

export interface LeafletCircleProps extends LeafletPathProps {
  /** [lng, lat] — Mapbox order. */
  center: [number, number]
  /** Radius in meters. */
  radius?: number
}

const LeafletCircleComponent = ({ center, radius, onClick, children, ...opts }: LeafletCircleProps) => {
  const onClickRef = useLatest(onClick)
  const optsRef = useLatest(opts)
  const layer = useLeafletLayer<L.Circle>((L) => {
    const l = L.circle(toLatLng(center), { ...optsRef.current, interactive: true, radius })
    l.on('click', (ev) => onClickRef.current?.(ev))
    return l
  })
  React.useEffect(() => {
    layer?.setLatLng(toLatLng(center))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layer, center?.[0], center?.[1]])
  React.useEffect(() => {
    if (radius !== undefined) layer?.setRadius(radius)
  }, [layer, radius])
  React.useEffect(() => {
    layer?.setStyle({ ...opts, interactive: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layer, opts.color, opts.weight, opts.opacity, opts.fill, opts.fillColor, opts.fillOpacity, opts.dashArray])
  return <LeafletLayerContext.Provider value={layer}>{children}</LeafletLayerContext.Provider>
}
LeafletCircleComponent.displayName = 'LeafletCircle'

export interface LeafletCircleMarkerProps extends LeafletPathProps {
  /** [lng, lat] — Mapbox order. */
  center: [number, number]
  /** Radius in pixels. */
  radius?: number
}

const LeafletCircleMarkerComponent = ({ center, radius, onClick, children, ...opts }: LeafletCircleMarkerProps) => {
  const onClickRef = useLatest(onClick)
  const optsRef = useLatest(opts)
  const layer = useLeafletLayer<L.CircleMarker>((L) => {
    const l = L.circleMarker(toLatLng(center), { ...optsRef.current, interactive: true, radius })
    l.on('click', (ev) => onClickRef.current?.(ev))
    return l
  })
  React.useEffect(() => {
    layer?.setLatLng(toLatLng(center))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layer, center?.[0], center?.[1]])
  React.useEffect(() => {
    if (radius !== undefined) layer?.setRadius(radius)
  }, [layer, radius])
  React.useEffect(() => {
    layer?.setStyle({ ...opts, interactive: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layer, opts.color, opts.weight, opts.opacity, opts.fill, opts.fillColor, opts.fillOpacity, opts.dashArray])
  return <LeafletLayerContext.Provider value={layer}>{children}</LeafletLayerContext.Provider>
}
LeafletCircleMarkerComponent.displayName = 'LeafletCircleMarker'

export interface LeafletGeoJsonProps {
  /** GeoJSON FeatureCollection / Feature / geometry. */
  geojson: GeoJSON.GeoJSON
  /** Leaflet GeoJSON options: `style`, `pointToLayer`, `onEachFeature`, `filter`, `coordsToLatLng`. */
  options?: L.GeoJSONOptions
  onClick?: (e: L.LeafletMouseEvent) => void
  children?: React.ReactNode
}

const LeafletGeoJsonComponent = ({ geojson, options, onClick, children }: LeafletGeoJsonProps) => {
  const onClickRef = useLatest(onClick)
  const optionsRef = useLatest(options)
  const layer = useLeafletLayer<L.GeoJSON>((L) => {
    const l = L.geoJSON(geojson as any, optionsRef.current)
    l.on('click', (ev) => onClickRef.current?.(ev))
    return l
  })
  React.useEffect(() => {
    if (!layer || !geojson) return
    layer.clearLayers()
    layer.addData(geojson as any)
  }, [layer, geojson])
  return <LeafletLayerContext.Provider value={layer}>{children}</LeafletLayerContext.Provider>
}
LeafletGeoJsonComponent.displayName = 'LeafletGeoJson'

export interface LeafletTileLayerProps {
  /** Raster tile URL template ({z}/{x}/{y}, optional {s} subdomains + {r} retina). */
  url: string
  attribution?: string
  subdomains?: string | string[]
  minZoom?: number
  maxZoom?: number
  opacity?: number
  zIndex?: number
  tms?: boolean
}

const LeafletTileLayerComponent = ({
  url,
  attribution,
  subdomains,
  minZoom,
  maxZoom,
  opacity,
  zIndex,
  tms,
}: LeafletTileLayerProps) => {
  const optsRef = useLatest({ attribution, subdomains, minZoom, maxZoom, opacity, zIndex, tms })
  const layer = useLeafletLayer<L.TileLayer>((L) => L.tileLayer(url, defined(optsRef.current)))
  React.useEffect(() => {
    if (url) layer?.setUrl(url)
  }, [layer, url])
  React.useEffect(() => {
    if (opacity !== undefined) layer?.setOpacity(opacity)
  }, [layer, opacity])
  React.useEffect(() => {
    if (zIndex !== undefined) layer?.setZIndex(zIndex)
  }, [layer, zIndex])
  return null
}
LeafletTileLayerComponent.displayName = 'LeafletTileLayer'

export {
  LeafletMapComponent as LeafletMap,
  LeafletMarkerComponent as LeafletMarker,
  LeafletPopupComponent as LeafletPopup,
  LeafletTooltipComponent as LeafletTooltip,
  LeafletPolylineComponent as LeafletPolyline,
  LeafletPolygonComponent as LeafletPolygon,
  LeafletCircleComponent as LeafletCircle,
  LeafletCircleMarkerComponent as LeafletCircleMarker,
  LeafletGeoJsonComponent as LeafletGeoJson,
  LeafletTileLayerComponent as LeafletTileLayer,
}
