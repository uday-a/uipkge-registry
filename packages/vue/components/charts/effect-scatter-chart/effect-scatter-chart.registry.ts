import { defineRegistryItem } from "../../../lib/define-registry";

export default defineRegistryItem({
  name: "effect-scatter-chart",
  type: "registry:ui",
  framework: "vue",
  categories: ["chart"],
  description:
    "Effect scatter chart with ripple animation around Apache ECharts. Highlights live points and alerts with a configurable ripple period. Theme-aware via registry tokens.",
  files: [
    {
      path: "EffectScatterChart.vue",
      target:
        "components/ui/charts/effect-scatter-chart/EffectScatterChart.vue",
    },
    {
      path: "index.ts",
      target: "components/ui/charts/effect-scatter-chart/index.ts",
    },
    {
      path: "../useChartTheme.ts",
      target: "components/ui/charts/useChartTheme.ts",
    },
  ],
  dependencies: ["echarts", "vue-echarts"],
  registryDependencies: [],
});
