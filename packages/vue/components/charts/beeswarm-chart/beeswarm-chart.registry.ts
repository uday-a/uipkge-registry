import { defineRegistryItem } from "../../../lib/define-registry";

export default defineRegistryItem({
  name: "beeswarm-chart",
  type: "registry:ui",
  framework: "vue",
  categories: ["chart"],
  description:
    "Beeswarm (jittered strip) plot around Apache ECharts. One dot per observation grouped on rows with deterministic jitter. Theme-aware via registry tokens.",
  files: [
    {
      path: "BeeswarmChart.vue",
      target: "components/ui/charts/beeswarm-chart/BeeswarmChart.vue",
    },
    {
      path: "index.ts",
      target: "components/ui/charts/beeswarm-chart/index.ts",
    },
    {
      path: "../useChartTheme.ts",
      target: "components/ui/charts/useChartTheme.ts",
    },
  ],
  dependencies: ["echarts", "vue-echarts"],
  registryDependencies: [],
});
