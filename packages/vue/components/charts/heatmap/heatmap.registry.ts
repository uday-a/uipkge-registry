import { defineRegistryItem } from "../../../lib/define-registry";

export default defineRegistryItem({
  name: "heatmap",
  type: "registry:ui",
  framework: "vue",
  categories: ["chart"],
  description:
    "Grid heatmap wrapper around Apache ECharts with visualMap color ramp. Theme-aware via registry tokens.",
  files: [
    { path: "Heatmap.vue", target: "components/ui/charts/heatmap/Heatmap.vue" },
    { path: "index.ts", target: "components/ui/charts/heatmap/index.ts" },
    {
      path: "../useChartTheme.ts",
      target: "components/ui/charts/useChartTheme.ts",
    },
  ],
  dependencies: ["echarts", "vue-echarts"],
  registryDependencies: [],
});
