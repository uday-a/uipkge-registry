import { defineRegistryItem } from "../../../lib/define-registry";

export default defineRegistryItem({
  name: "choropleth-map-chart",
  type: "registry:ui",
  categories: ["chart"],
  description:
    "React mirror of @uipkge/choropleth-map-chart — see the Vue registry item for the canonical description.",
  files: [
    {
      path: "ChoroplethMapChart.tsx",
      target:
        "components/ui/charts/choropleth-map-chart/ChoroplethMapChart.tsx",
    },
    {
      path: "index.ts",
      target: "components/ui/charts/choropleth-map-chart/index.ts",
    },
  ],
  dependencies: ["lucide-react"],
  registryDependencies: ["https://uipkge.dev/r/map.json"],
});
