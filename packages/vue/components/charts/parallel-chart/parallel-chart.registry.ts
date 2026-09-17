import { defineRegistryItem } from "../../../lib/define-registry";

export default defineRegistryItem({
  name: "parallel-chart",
  type: "registry:ui",
  framework: "vue",
  categories: ["chart"],
  description:
    "Parallel coordinates wrapper around Apache ECharts. Plots high-dimensional rows as polylines across N axes — useful for spotting correlations and outlier clusters.",
  files: [
    {
      path: "ParallelChart.vue",
      target: "components/ui/charts/parallel-chart/ParallelChart.vue",
    },
    {
      path: "index.ts",
      target: "components/ui/charts/parallel-chart/index.ts",
    },
    {
      path: "../useChartTheme.ts",
      target: "components/ui/charts/useChartTheme.ts",
    },
  ],
  dependencies: ["echarts", "vue-echarts"],
  registryDependencies: [],
});
