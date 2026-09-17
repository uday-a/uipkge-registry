export {
  Map,
  MapMarker,
  MapPopup,
  MapSource,
  MapLayer,
  type MapMarkerProps,
  type MapPopupProps,
  type MapSourceProps,
  type MapLayerProps,
} from "./map";
export type { MapProps } from "./map";
export type { MapRef } from "react-map-gl/mapbox";
export {
  mapVariants,
  MAPBOX_STYLES,
  type MapVariant,
  type MapVariants,
} from "./map.variants";

// Re-exported from react-map-gl under Map* names so consumers get the whole map
// toolkit from one import. Place these inside <Map>'s children — they read the
// map instance from the wrapping react-map-gl context.
export {
  NavigationControl as MapNavigationControl,
  FullscreenControl as MapFullscreenControl,
} from "react-map-gl/mapbox";
