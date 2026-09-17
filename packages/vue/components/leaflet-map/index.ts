import type LeafletMap from './LeafletMap.vue'

export { default as LeafletMap } from './LeafletMap.vue'

/** Handle returned by a template ref on <LeafletMap> — mirrors the `map`
 *  component's MapRef: camera helpers plus `map` / `getMap()` for the raw
 *  Leaflet Map. */
export type LeafletMapRef = InstanceType<typeof LeafletMap>
export {
  leafletMapVariants,
  LEAFLET_TILES,
  LEAFLET_THEME_TILES,
  type LeafletMapVariant,
  type LeafletMapVariants,
  type LeafletTilePreset,
} from './leaflet-map.variants'

export { default as LeafletMarker } from './LeafletMarker.vue'
export { default as LeafletPopup } from './LeafletPopup.vue'
export { default as LeafletTooltip } from './LeafletTooltip.vue'
export { default as LeafletPolyline } from './LeafletPolyline.vue'
export { default as LeafletPolygon } from './LeafletPolygon.vue'
export { default as LeafletCircle } from './LeafletCircle.vue'
export { default as LeafletCircleMarker } from './LeafletCircleMarker.vue'
export { default as LeafletGeoJson } from './LeafletGeoJson.vue'
export { default as LeafletTileLayer } from './LeafletTileLayer.vue'

export { loadLeaflet, toLatLng, toLatLngs, toLatLngBounds, useLeafletMap } from './leaflet-context'
