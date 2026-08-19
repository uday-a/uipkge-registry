import { defineRegistryItem } from "../../../lib/define-registry";

export default defineRegistryItem({
  name: "icicle-chart",
  type: "registry:ui",
  framework: "vue",
  categories: ["chart"],
  description:
    "Icicle (partition) chart around Apache ECharts custom series — ECharts ships no icicle series, so this partitions one rect per node top-down with in-canvas labels. Theme-aware via registry tokens.",
  files: [
    {
      path: "IcicleChart.vue",
      target: "components/ui/charts/icicle-chart/IcicleChart.vue",
    },
    { path: "index.ts", target: "components/ui/charts/icicle-chart/index.ts" },
    {
      path: "../useChartTheme.ts",
      target: "components/ui/charts/useChartTheme.ts",
    },
  ],
  dependencies: ["echarts", "vue-echarts"],
  registryDependencies: [],
});
