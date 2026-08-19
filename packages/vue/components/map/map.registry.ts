import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "map",
  type: "registry:ui",
  categories: ["data-display"],
  title: "Map",
  framework: "vue",
  description:
    "A thin, theme-aware Mapbox GL JS wrapper (built on @studiometa/vue-mapbox-gl). Pass an access token and drop MapMarker / MapPopup / MapLayer into the slot to build any map — fleet boards, journey maps, store locators. The base style follows light/dark automatically, an opt-in `muted` prop desaturates the basemap so overlaid data is the only colour, and `@created` hands you the raw map instance for custom layers and fitBounds.",
  files: [
    { path: "Map.vue", target: "components/ui/map/Map.vue" },
    { path: "MapSource.vue", target: "components/ui/map/MapSource.vue" },
    { path: "MapLayer.vue", target: "components/ui/map/MapLayer.vue" },
    { path: "map.variants.ts", target: "components/ui/map/map.variants.ts" },
    { path: "index.ts", target: "components/ui/map/index.ts" },
    { path: "map.css", target: "components/ui/map/map.css" },
  ],
  dependencies: [
    "mapbox-gl",
    "@studiometa/vue-mapbox-gl",
    "class-variance-authority",
  ],
  registryDependencies: [],
});
