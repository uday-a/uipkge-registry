import { defineRegistryItem } from "../../../lib/define-registry";

export default defineRegistryItem({
  name: "line-chart",
  type: "registry:ui",
  categories: ["chart"],
  description:
    "React mirror of @uipkge/line-chart — see the Vue registry item for the canonical description.",
  files: [
    {
      path: "LineChart.tsx",
      target: "components/ui/charts/line-chart/LineChart.tsx",
    },
    { path: "index.ts", target: "components/ui/charts/line-chart/index.ts" },
    {
      path: "../useChartTheme.ts",
      target: "components/ui/charts/useChartTheme.ts",
    },
    { path: "../shared.tsx", target: "components/ui/charts/shared.tsx" },
  ],
  dependencies: ["echarts", "echarts-for-react"],
  registryDependencies: [],
});
