import { getContext, setContext } from 'svelte'
import type mapboxgl from 'mapbox-gl'

export const MAP_KEY = 'uipkge-map'
export const MAP_SOURCE_ID_KEY = 'uipkge-map-source-id'

/** Reactive view of the enclosing `<Map>` instance. Reads track, so an
 *  `$effect` re-runs when the map is created. */
export interface MapContext {
  readonly map: mapboxgl.Map | null
}

/** Published by `<Map>` once per instance. Must be called during init. */
export function setMapContext(ctx: MapContext): void {
  setContext(MAP_KEY, ctx)
}

/** Injects the map context published by the enclosing `<Map>`. */
export function useMap(): MapContext {
  const ctx = getContext<MapContext>(MAP_KEY)
  if (!ctx) {
    throw new Error('uipkge: Map* components must be rendered inside <Map>.')
  }
  return ctx
}

/** Published by `<MapSource>` so nested `<MapLayer>` picks up its source id. */
export function setMapSourceId(id: string): void {
  setContext(MAP_SOURCE_ID_KEY, id)
}

/** The enclosing `<MapSource>` id, if any. */
export function useMapSourceId(): string | undefined {
  return getContext<string | undefined>(MAP_SOURCE_ID_KEY) ?? undefined
}
