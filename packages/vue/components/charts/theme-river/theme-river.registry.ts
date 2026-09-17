import { defineRegistryItem } from "../../../lib/define-registry";

export default defineRegistryItem({
  name: "theme-river",
  type: "registry:ui",
  framework: "vue",
  categories: ["chart"],
  description:
    "Theme-river (streamgraph) wrapper around Apache ECharts. Stacked areas centred on a baseline along a time axis — good for topic-volume drift over time.",
  files: [
    {
      path: "ThemeRiver.vue",
      target: "components/ui/charts/theme-river/ThemeRiver.vue",
    },
    { path: "index.ts", target: "components/ui/charts/theme-river/index.ts" },
    {
      path: "../useChartTheme.ts",
      target: "components/ui/charts/useChartTheme.ts",
    },
  ],
  dependencies: ["echarts", "vue-echarts"],
  registryDependencies: [],
});
