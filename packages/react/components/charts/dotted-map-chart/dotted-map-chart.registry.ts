import { defineRegistryItem } from "../../../lib/define-registry";

export default defineRegistryItem({
  name: "dotted-map-chart",
  type: "registry:ui",
  categories: ["chart"],
  description:
    "React mirror of @uipkge/dotted-map-chart — see the Vue registry item for the canonical description.",
  files: [
    {
      path: "DottedMapChart.tsx",
      target: "components/ui/charts/dotted-map-chart/DottedMapChart.tsx",
    },
    {
      path: "index.ts",
      target: "components/ui/charts/dotted-map-chart/index.ts",
    },
  ],
  dependencies: ["mapbox-gl", "react-map-gl", "lucide-react"],
  registryDependencies: ["https://uipkge.dev/r/map.json"],
});
