import { getContext, onDestroy, setContext } from 'svelte'
import type * as L from 'leaflet'

export const LEAFLET_MAP_KEY = 'uipkge-leaflet-map'
export const LEAFLET_LAYER_KEY = 'uipkge-leaflet-layer'

type LeafletModule = typeof import('leaflet')

let leafletPromise: Promise<LeafletModule> | null = null

/**
 * Lazily loads Leaflet's ESM build. Leaflet touches `window`/`document` at
 * import time, so a static top-level import would crash SSR renders — every
 * consumer of this helper resolves the module only on the client.
 */
export function loadLeaflet(): Promise<LeafletModule> {
  if (!leafletPromise) leafletPromise = import('leaflet')
  return leafletPromise
}

/** [lng, lat] (Mapbox order, matching the `map` component) -> Leaflet [lat, lng]. */
export function toLatLng(c: [number, number]): L.LatLngExpression {
  return [c[1], c[0]]
}

/** Converts a [lng, lat][] path to Leaflet [lat, lng][]. */
export function toLatLngs(
  path: [number, number][] | [number, number][][],
): L.LatLngExpression[] | L.LatLngExpression[][] {
  if (!path.length) return []
  return Array.isArray(path[0][0])
    ? (path as [number, number][][]).map((ring) => ring.map(toLatLng))
    : (path as [number, number][]).map(toLatLng)
}

/** [[west,south],[east,north]] in [lng, lat] -> a bounds literal Leaflet accepts. */
export function toLatLngBounds(bounds: [[number, number], [number, number]]): L.LatLngBoundsExpression {
  return [toLatLng(bounds[0]), toLatLng(bounds[1])] as L.LatLngBoundsExpression
}

export type LeafletPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

/**
 * Leaflet merges layer options by assignment, so passing `undefined` would
 * clobber its defaults (e.g. `subdomains: 'abc'` -> crash). Strip undefined
 * keys before handing options to Leaflet.
 */
export function defined<T extends object>(o: T): T {
  return Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined)) as T
}

/** Reactive view of the enclosing `<LeafletMap>` instance. Reads track, so an
 *  `$effect` re-runs when the map is created. */
export interface LeafletMapContext {
  readonly map: L.Map | null
}

/** Published by `<LeafletMap>` once per instance. Must be called during init. */
export function setLeafletMapContext(ctx: LeafletMapContext): void {
  setContext(LEAFLET_MAP_KEY, ctx)
}

/** Injects the map context published by the enclosing `<LeafletMap>`. */
export function useLeafletMap(): LeafletMapContext {
  const ctx = getContext<LeafletMapContext>(LEAFLET_MAP_KEY)
  if (!ctx) {
    throw new Error('uipkge: Leaflet* components must be rendered inside <LeafletMap>.')
  }
  return ctx
}

/** Reactive view of the nearest ancestor layer a popup/tooltip binds to. */
export interface LeafletLayerContext {
  readonly current: L.Layer | null
}

/** Reactive view of a layer built by `useLeafletLayer`, keeping its concrete type. */
export interface LeafletLayerRef<T extends L.Layer> {
  readonly current: T | null
}

/**
 * Waits for the enclosing `<LeafletMap>` instance, builds the layer once, adds
 * it to the map, and removes it on unmount. The layer is also provided so
 * nested `<LeafletPopup>` / `<LeafletTooltip>` children can bind to it.
 * Must be called during component init.
 */
export function useLeafletLayer<T extends L.Layer>(
  build: (map: L.Map, leaflet: LeafletModule) => T,
  opts: { addToMap?: boolean } = {},
): LeafletLayerRef<T> {
  const mapCtx = useLeafletMap()
  let layer = $state<T | null>(null)
  const ctx: LeafletLayerRef<T> = {
    get current(): T | null {
      return layer
    },
  }
  setContext(LEAFLET_LAYER_KEY, ctx satisfies LeafletLayerContext)

  let cancelled = false
  $effect(() => {
    const map = mapCtx.map
    if (!map || layer) return
    let alive = true
    void (async () => {
      const Ll = await loadLeaflet()
      if (!alive || cancelled || layer) return
      const instance = build(map, Ll)
      layer = instance
      if (opts.addToMap !== false) instance.addTo(map)
    })()
    return () => {
      alive = false
    }
  })

  onDestroy(() => {
    cancelled = true
    try {
      layer?.remove()
    } catch {
      /* map already destroyed */
    }
    layer = null
  })

  return ctx
}

/** The nearest ancestor layer (marker, polyline, …) a popup/tooltip binds to. */
export function useParentLeafletLayer(): LeafletLayerContext | null {
  return getContext<LeafletLayerContext | null>(LEAFLET_LAYER_KEY) ?? null
}

const LEAFLET_ICON_BASE = 'https://unpkg.com/leaflet@1.9.4/dist/images'
let defaultIconFixed = false

/**
 * Leaflet's default pin references image paths relative to the CSS file, which
 * bundlers can't resolve — point them at the versioned unpkg assets instead.
 * Only matters for markers without custom slot content.
 */
export function fixDefaultLeafletIcon(Ll: LeafletModule) {
  if (defaultIconFixed) return
  defaultIconFixed = true
  Ll.Icon.Default.mergeOptions({
    iconRetinaUrl: `${LEAFLET_ICON_BASE}/marker-icon-2x.png`,
    iconUrl: `${LEAFLET_ICON_BASE}/marker-icon.png`,
    shadowUrl: `${LEAFLET_ICON_BASE}/marker-shadow.png`,
  })
}
