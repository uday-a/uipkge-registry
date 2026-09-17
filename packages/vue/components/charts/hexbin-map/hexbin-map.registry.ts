import { defineRegistryItem } from "../../../lib/define-registry";

export default defineRegistryItem({
  name: "hexbin-map",
  type: "registry:ui",
  framework: "vue",
  categories: ["chart"],
  description:
    "US 50 states + DC hexbin cartogram chart rendered as pure dependency-free SVG. Pointy-top hexagonal grid with automatic color scale ramps, state abbreviation labels, metric values, interactive hover tooltips, and keyboard-accessible state selection.",
  files: [
    {
      path: "HexbinMap.vue",
      target: "components/ui/charts/hexbin-map/HexbinMap.vue",
    },
    { path: "index.ts", target: "components/ui/charts/hexbin-map/index.ts" },
  ],
  dependencies: ["lucide-vue-next"],
  registryDependencies: ["https://uipkge.dev/r/map.json"],
});
