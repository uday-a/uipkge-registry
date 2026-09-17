import { defineRegistryItem } from "../../../lib/define-registry";

export default defineRegistryItem({
  name: "dumbbell-chart",
  type: "registry:ui",
  framework: "vue",
  categories: ["chart"],
  description:
    "Dumbbell chart around Apache ECharts custom series. Before/after dots joined per category for change comparison. Theme-aware via registry tokens.",
  files: [
    {
      path: "DumbbellChart.vue",
      target: "components/ui/charts/dumbbell-chart/DumbbellChart.vue",
    },
    {
      path: "index.ts",
      target: "components/ui/charts/dumbbell-chart/index.ts",
    },
    {
      path: "../useChartTheme.ts",
      target: "components/ui/charts/useChartTheme.ts",
    },
  ],
  dependencies: ["echarts", "vue-echarts"],
  registryDependencies: [],
});
