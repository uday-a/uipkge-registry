import { inject, onUnmounted, provide, shallowRef, watch, type ShallowRef } from 'vue'
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

/** Injects the map instance ref published by the enclosing `<LeafletMap>`. */
export function useLeafletMap(): ShallowRef<L.Map | null> {
  const map = inject<ShallowRef<L.Map | null>>(LEAFLET_MAP_KEY)
  if (!map) {
    throw new Error('uipkge: Leaflet* components must be rendered inside <LeafletMap>.')
  }
  return map
}

/**
 * Waits for the enclosing `<LeafletMap>` instance, builds the layer once, adds
 * it to the map, and removes it on unmount. The layer is also provided so
 * nested `<LeafletPopup>` / `<LeafletTooltip>` children can bind to it.
 */
export function useLeafletLayer<T extends L.Layer>(
  build: (map: L.Map, L: LeafletModule) => T,
  opts: { addToMap?: boolean } = {},
): ShallowRef<T | null> {
  const mapRef = useLeafletMap()
  const layer = shallowRef<T | null>(null) as ShallowRef<T | null>
  provide(LEAFLET_LAYER_KEY, layer as ShallowRef<L.Layer | null>)

  const stop = watch(
    mapRef,
    async (map) => {
      if (!map || layer.value) return
      const L = await loadLeaflet()
      if (layer.value) return
      const instance = build(map, L)
      layer.value = instance
      if (opts.addToMap !== false) instance.addTo(map)
    },
    { immediate: true },
  )

  onUnmounted(() => {
    stop()
    layer.value?.remove()
    layer.value = null
  })

  return layer
}

/** The nearest ancestor layer (marker, polyline, …) a popup/tooltip binds to. */
export function useParentLeafletLayer(): ShallowRef<L.Layer | null> | null {
  return inject<ShallowRef<L.Layer | null> | null>(LEAFLET_LAYER_KEY, null)
}

const LEAFLET_ICON_BASE = 'https://unpkg.com/leaflet@1.9.4/dist/images'
let defaultIconFixed = false

/**
 * Leaflet's default pin references image paths relative to the CSS file, which
 * bundlers can't resolve — point them at the versioned unpkg assets instead.
 * Only matters for markers without custom slot content.
 */
export function fixDefaultLeafletIcon(L: LeafletModule) {
  if (defaultIconFixed) return
  defaultIconFixed = true
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: `${LEAFLET_ICON_BASE}/marker-icon-2x.png`,
    iconUrl: `${LEAFLET_ICON_BASE}/marker-icon.png`,
    shadowUrl: `${LEAFLET_ICON_BASE}/marker-shadow.png`,
  })
}
