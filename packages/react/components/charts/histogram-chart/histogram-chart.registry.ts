import { defineRegistryItem } from "../../../lib/define-registry";

export default defineRegistryItem({
  name: "histogram-chart",
  type: "registry:ui",
  categories: ["chart"],
  description:
    "React mirror of @uipkge/histogram-chart — see the Vue registry item for the canonical description.",
  files: [
    {
      path: "HistogramChart.tsx",
      target: "components/ui/charts/histogram-chart/HistogramChart.tsx",
    },
    {
      path: "index.ts",
      target: "components/ui/charts/histogram-chart/index.ts",
    },
    {
      path: "../useChartTheme.ts",
      target: "components/ui/charts/useChartTheme.ts",
    },
    { path: "../shared.tsx", target: "components/ui/charts/shared.tsx" },
  ],
  dependencies: ["echarts", "echarts-for-react"],
  registryDependencies: [],
});
