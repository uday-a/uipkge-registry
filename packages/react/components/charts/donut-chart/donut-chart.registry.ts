import { defineRegistryItem } from "../../../lib/define-registry";

export default defineRegistryItem({
  name: "donut-chart",
  type: "registry:ui",
  categories: ["chart"],
  description:
    "React mirror of @uipkge/donut-chart — see the Vue registry item for the canonical description.",
  files: [
    {
      path: "DonutChart.tsx",
      target: "components/ui/charts/donut-chart/DonutChart.tsx",
    },
    { path: "index.ts", target: "components/ui/charts/donut-chart/index.ts" },
    {
      path: "../useChartTheme.ts",
      target: "components/ui/charts/useChartTheme.ts",
    },
    { path: "../shared.tsx", target: "components/ui/charts/shared.tsx" },
  ],
  dependencies: ["echarts", "echarts-for-react"],
  registryDependencies: [],
});
