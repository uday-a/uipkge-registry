import { defineRegistryItem } from "../../../lib/define-registry";

export default defineRegistryItem({
  name: "nightingale-chart",
  type: "registry:ui",
  framework: "vue",
  categories: ["chart"],
  description:
    "Nightingale (rose) chart around Apache ECharts. Radius-encoded pie with rounded segments. Theme-aware via registry tokens.",
  files: [
    {
      path: "NightingaleChart.vue",
      target: "components/ui/charts/nightingale-chart/NightingaleChart.vue",
    },
    {
      path: "index.ts",
      target: "components/ui/charts/nightingale-chart/index.ts",
    },
    {
      path: "../useChartTheme.ts",
      target: "components/ui/charts/useChartTheme.ts",
    },
  ],
  dependencies: ["echarts", "vue-echarts"],
  registryDependencies: [],
});
