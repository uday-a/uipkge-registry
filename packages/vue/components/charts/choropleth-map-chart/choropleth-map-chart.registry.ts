import { defineRegistryItem } from "../../../lib/define-registry";

export default defineRegistryItem({
  name: "choropleth-map-chart",
  type: "registry:ui",
  framework: "vue",
  categories: ["chart"],
  description:
    "Choropleth map around Apache ECharts with bring-your-own GeoJSON (registered via registerMap). Value-shaded areas with roam, plus pin markers and curved links. Theme-aware via registry tokens.",
  files: [
    {
      path: "ChoroplethMapChart.vue",
      target:
        "components/ui/charts/choropleth-map-chart/ChoroplethMapChart.vue",
    },
    {
      path: "index.ts",
      target: "components/ui/charts/choropleth-map-chart/index.ts",
    },
  ],
  dependencies: ["lucide-vue-next"],
  registryDependencies: ["https://uipkge.dev/r/map.json"],
});
