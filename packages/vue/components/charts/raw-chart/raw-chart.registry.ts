import { defineRegistryItem } from "../../../lib/define-registry";

export default defineRegistryItem({
  name: "raw-chart",
  type: "registry:ui",
  framework: "vue",
  categories: ["chart"],
  description:
    "Escape-hatch wrapper that takes a full ECharts option object. Lets you build any ECharts type (sankey, sunburst, candlestick, graph, boxplot, parallel, themeRiver, custom) with full customization. Theme-aware exports available via useChartTheme.",
  files: [
    {
      path: "RawChart.vue",
      target: "components/ui/charts/raw-chart/RawChart.vue",
    },
    { path: "index.ts", target: "components/ui/charts/raw-chart/index.ts" },
    {
      path: "../useChartTheme.ts",
      target: "components/ui/charts/useChartTheme.ts",
    },
  ],
  dependencies: ["echarts", "vue-echarts"],
  registryDependencies: [],
});
