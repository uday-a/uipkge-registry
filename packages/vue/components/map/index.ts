import type Map from "./Map.vue";

export { default as Map } from "./Map.vue";

/** Handle returned by a template ref on <Map> — mirrors react-map-gl's MapRef.
 *  Carries the camera helpers plus `map` / `getMap()` for the raw mapbox-gl Map. */
export type MapRef = InstanceType<typeof Map>;
export {
  mapVariants,
  MAPBOX_STYLES,
  type MapVariant,
  type MapVariants,
} from "./map.variants";

export { default as MapSource } from "./MapSource.vue";
export { default as MapLayer } from "./MapLayer.vue";

// Re-exported from @studiometa/vue-mapbox-gl under Map* names so consumers get
// the whole map toolkit from one import. Place these inside <Map>'s slot — they
// inject the map instance from the wrapping MapboxMap.
export {
  MapboxMarker as MapMarker,
  MapboxPopup as MapPopup,
  MapboxNavigationControl as MapNavigationControl,
  MapboxFullscreenControl as MapFullscreenControl,
} from "@studiometa/vue-mapbox-gl";
