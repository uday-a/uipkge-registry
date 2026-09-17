import { defineRegistryItem } from "../../../lib/define-registry";

export default defineRegistryItem({
  name: "segmented-gauge",
  type: "registry:ui",
  framework: "vue",
  categories: ["chart"],
  description:
    "Semicircular SVG gauge split into colored segments by relative value. Pure SVG (no ECharts). Rounded line caps + an angular gap between segments produce the pill-shaped look; a center slot lets consumers drop a KPI value + label into the dish.",
  files: [
    {
      path: "SegmentedGauge.vue",
      target: "components/ui/charts/segmented-gauge/SegmentedGauge.vue",
    },
    {
      path: "index.ts",
      target: "components/ui/charts/segmented-gauge/index.ts",
    },
  ],
  dependencies: [],
  registryDependencies: [],
});
