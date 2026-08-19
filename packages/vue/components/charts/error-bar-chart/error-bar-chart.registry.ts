import { defineRegistryItem } from "../../../lib/define-registry";

export default defineRegistryItem({
  name: "error-bar-chart",
  type: "registry:ui",
  framework: "vue",
  categories: ["chart"],
  description:
    "Error-bar chart around Apache ECharts custom series. Mean bars with confidence-interval whiskers and caps. Theme-aware via registry tokens.",
  files: [
    {
      path: "ErrorBarChart.vue",
      target: "components/ui/charts/error-bar-chart/ErrorBarChart.vue",
    },
    {
      path: "index.ts",
      target: "components/ui/charts/error-bar-chart/index.ts",
    },
    {
      path: "../useChartTheme.ts",
      target: "components/ui/charts/useChartTheme.ts",
    },
  ],
  dependencies: ["echarts", "vue-echarts"],
  registryDependencies: [],
});
