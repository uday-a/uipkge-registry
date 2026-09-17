import { defineRegistryItem } from "../../../lib/define-registry";

export default defineRegistryItem({
  name: "boxplot-chart",
  type: "registry:ui",
  framework: "vue",
  categories: ["chart"],
  description:
    "Box-and-whisker plot wrapper around Apache ECharts. Five-number summary (min, Q1, median, Q3, max) per category. Vertical or horizontal.",
  files: [
    {
      path: "BoxplotChart.vue",
      target: "components/ui/charts/boxplot-chart/BoxplotChart.vue",
    },
    { path: "index.ts", target: "components/ui/charts/boxplot-chart/index.ts" },
    {
      path: "../useChartTheme.ts",
      target: "components/ui/charts/useChartTheme.ts",
    },
  ],
  dependencies: ["echarts", "vue-echarts"],
  registryDependencies: [],
});
