import { defineRegistryItem } from "../../../lib/define-registry";

export default defineRegistryItem({
  name: "pie-chart",
  type: "registry:ui",
  framework: "vue",
  categories: ["chart"],
  description:
    "Pie chart wrapper around Apache ECharts. Full pie, donut, rose (Nightingale), and labeled variants. Theme-aware via registry tokens.",
  files: [
    {
      path: "PieChart.vue",
      target: "components/ui/charts/pie-chart/PieChart.vue",
    },
    { path: "index.ts", target: "components/ui/charts/pie-chart/index.ts" },
    {
      path: "../useChartTheme.ts",
      target: "components/ui/charts/useChartTheme.ts",
    },
  ],
  dependencies: ["echarts", "vue-echarts"],
  registryDependencies: [],
});
