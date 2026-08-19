import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "leaflet-map",
  type: "registry:ui",
  categories: ["data-display"],
  title: "Leaflet Map",
  framework: "react",
  description:
    "A thin, theme-aware Leaflet wrapper rendering free raster tiles (OpenStreetMap, OpenTopoMap, Esri) — no API key required. Drop LeafletMarker / LeafletPopup / LeafletPolyline / LeafletGeoJson into the children to build any map — fleet boards, journey maps, store locators. The base style follows light/dark automatically, an opt-in `muted` prop desaturates the tile pane so overlaid data is the only colour, and `onCreated` hands you the raw L.Map instance for custom layers and fitBounds. The Mapbox counterpart (`map`) adds GL styles, 3D, and globe; this one trades those for zero-key setup. Import `leaflet/dist/leaflet.css` once — the component does it for you.",
  files: [
    {
      path: "leaflet-map.tsx",
      target: "components/ui/leaflet-map/leaflet-map.tsx",
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
  dependencies: [
    "leaflet",
    "@types/leaflet",
    "next-themes",
    "class-variance-authority",
  ],
  registryDependencies: [],
});
