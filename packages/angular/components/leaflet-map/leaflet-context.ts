import { InjectionToken } from '@angular/core'
import type * as L from 'leaflet'

/**
 * Angular port of `leaflet-context.ts`. Leaflet touches `window`/`document`
 * at import time, so the module is resolved lazily on the client only via
 * `loadLeaflet()` — never a static top-level import.
 */

export type LeafletModule = typeof import('leaflet')

/** Published by `<ui-leaflet-map>`; injected by `ui-leaflet-*` children. */
export const LEAFLET_MAP = new InjectionToken<L.Map | null>('uipkge-leaflet-map')

/** Nearest ancestor layer a popup/tooltip binds to. */
export const LEAFLET_PARENT_LAYER = new InjectionToken<L.Layer | null>('uipkge-leaflet-layer')

let leafletPromise: Promise<LeafletModule> | null = null

/** Lazily loads Leaflet's ESM build (client only). */
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
  return Array.isArray(path[0]![0])
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

const LEAFLET_ICON_BASE = 'https://unpkg.com/leaflet@1.9.4/dist/images'
let defaultIconFixed = false

/**
 * Leaflet's default pin references image paths relative to the CSS file, which
 * bundlers can't resolve — point them at the versioned unpkg assets instead.
 */
export function fixDefaultLeafletIcon(Lmod: LeafletModule): void {
  if (defaultIconFixed) return
  defaultIconFixed = true
  Lmod.Icon.Default.mergeOptions({
    iconRetinaUrl: `${LEAFLET_ICON_BASE}/marker-icon-2x.png`,
    iconUrl: `${LEAFLET_ICON_BASE}/marker-icon.png`,
    shadowUrl: `${LEAFLET_ICON_BASE}/marker-shadow.png`,
  })
}
