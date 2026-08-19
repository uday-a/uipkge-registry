import { defineRegistryItem } from "../../../lib/define-registry";

export default defineRegistryItem({
  name: "marimekko-chart",
  type: "registry:ui",
  framework: "vue",
  categories: ["chart"],
  description:
    "Marimekko (mosaic) chart around Apache ECharts custom series. Column widths encode column totals, stacked segments encode within-column shares, with in-canvas labels. Theme-aware via registry tokens.",
  files: [
    {
      path: "MarimekkoChart.vue",
      target: "components/ui/charts/marimekko-chart/MarimekkoChart.vue",
    },
    {
      path: "index.ts",
      target: "components/ui/charts/marimekko-chart/index.ts",
    },
    {
      path: "../useChartTheme.ts",
      target: "components/ui/charts/useChartTheme.ts",
    },
  ],
  dependencies: ["echarts", "vue-echarts"],
  registryDependencies: [],
});
