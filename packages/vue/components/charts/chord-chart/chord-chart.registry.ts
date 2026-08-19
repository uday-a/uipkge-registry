import { defineRegistryItem } from "../../../lib/define-registry";

export default defineRegistryItem({
  name: "chord-chart",
  type: "registry:ui",
  framework: "vue",
  categories: ["chart"],
  description:
    "Chord diagram around Apache ECharts. Circular nodes with weighted ribbons and adjacency focus. Theme-aware via registry tokens.",
  files: [
    {
      path: "ChordChart.vue",
      target: "components/ui/charts/chord-chart/ChordChart.vue",
    },
    { path: "index.ts", target: "components/ui/charts/chord-chart/index.ts" },
    {
      path: "../useChartTheme.ts",
      target: "components/ui/charts/useChartTheme.ts",
    },
  ],
  dependencies: ["echarts", "vue-echarts"],
  registryDependencies: [],
});
