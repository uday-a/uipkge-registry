import { defineRegistryItem } from "../../../lib/define-registry";

export default defineRegistryItem({
  name: "sankey-chart",
  type: "registry:ui",
  framework: "vue",
  categories: ["chart"],
  description:
    "Sankey flow diagram wrapper around Apache ECharts. Visualizes value flows between named nodes (channels, stages, sources). Gradient links + theme-aware tokens.",
  files: [
    {
      path: "SankeyChart.vue",
      target: "components/ui/charts/sankey-chart/SankeyChart.vue",
    },
    { path: "index.ts", target: "components/ui/charts/sankey-chart/index.ts" },
    {
      path: "../useChartTheme.ts",
      target: "components/ui/charts/useChartTheme.ts",
    },
  ],
  dependencies: ["echarts", "vue-echarts"],
  registryDependencies: [],
});
