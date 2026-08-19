import { defineRegistryItem } from "../../../lib/define-registry";

export default defineRegistryItem({
  name: "stacked-bar-chart",
  type: "registry:ui",
  categories: ["chart"],
  description:
    "React mirror of @uipkge/stacked-bar-chart — see the Vue registry item for the canonical description.",
  files: [
    {
      path: "StackedBarChart.tsx",
      target: "components/ui/charts/stacked-bar-chart/StackedBarChart.tsx",
    },
    {
      path: "index.ts",
      target: "components/ui/charts/stacked-bar-chart/index.ts",
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
