import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "leaflet-map",
  type: "registry:ui",
  categories: ["data-display"],
  title: "Leaflet Map",
  framework: "vue",
  description:
    "A thin, theme-aware Leaflet wrapper rendering free raster tiles (OpenStreetMap, OpenTopoMap, Esri) — no API key required. Drop LeafletMarker / LeafletPopup / LeafletPolyline / LeafletGeoJson into the slot to build any map — fleet boards, journey maps, store locators. The base style follows light/dark automatically, an opt-in `muted` prop desaturates the tile pane so overlaid data is the only colour, and `@created` hands you the raw L.Map instance for custom layers and fitBounds. The Mapbox counterpart (`map`) adds GL styles, 3D, and globe; this one trades those for zero-key setup.",
  files: [
    {
      path: "LeafletMap.vue",
      target: "components/ui/leaflet-map/LeafletMap.vue",
    },
    {
      path: "LeafletMarker.vue",
      target: "components/ui/leaflet-map/LeafletMarker.vue",
    },
    {
      path: "LeafletPopup.vue",
      target: "components/ui/leaflet-map/LeafletPopup.vue",
    },
    {
      path: "LeafletTooltip.vue",
      target: "components/ui/leaflet-map/LeafletTooltip.vue",
    },
    {
      path: "LeafletPolyline.vue",
      target: "components/ui/leaflet-map/LeafletPolyline.vue",
    },
    {
      path: "LeafletPolygon.vue",
      target: "components/ui/leaflet-map/LeafletPolygon.vue",
    },
    {
      path: "LeafletCircle.vue",
      target: "components/ui/leaflet-map/LeafletCircle.vue",
    },
    {
      path: "LeafletCircleMarker.vue",
      target: "components/ui/leaflet-map/LeafletCircleMarker.vue",
    },
    {
      path: "LeafletGeoJson.vue",
      target: "components/ui/leaflet-map/LeafletGeoJson.vue",
    },
    {
      path: "LeafletTileLayer.vue",
      target: "components/ui/leaflet-map/LeafletTileLayer.vue",
    },
    {
      path: "leaflet-context.ts",
      target: "components/ui/leaflet-map/leaflet-context.ts",
    },
    {
      path: "leaflet-map.variants.ts",
      target: "components/ui/leaflet-map/leaflet-map.variants.ts",
    },
    { path: "index.ts", target: "components/ui/leaflet-map/index.ts" },
    {
      path: "leaflet-map.css",
      target: "components/ui/leaflet-map/leaflet-map.css",
    },
  ],
  dependencies: ["leaflet", "@types/leaflet", "class-variance-authority"],
  registryDependencies: [],
});
