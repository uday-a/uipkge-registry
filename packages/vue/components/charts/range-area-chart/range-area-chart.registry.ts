import { defineRegistryItem } from "../../../lib/define-registry";

export default defineRegistryItem({
  name: "range-area-chart",
  type: "registry:ui",
  framework: "vue",
  categories: ["chart"],
  description:
    "Range-area chart around Apache ECharts. Min/max uncertainty band with an average trend line. Theme-aware via registry tokens.",
  files: [
    {
      path: "RangeAreaChart.vue",
      target: "components/ui/charts/range-area-chart/RangeAreaChart.vue",
    },
    {
      path: "index.ts",
      target: "components/ui/charts/range-area-chart/index.ts",
    },
    {
      path: "../useChartTheme.ts",
      target: "components/ui/charts/useChartTheme.ts",
    },
  ],
  dependencies: ["echarts", "vue-echarts"],
  registryDependencies: [],
});
