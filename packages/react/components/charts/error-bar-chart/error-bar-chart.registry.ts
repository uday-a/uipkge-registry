import { defineRegistryItem } from "../../../lib/define-registry";

export default defineRegistryItem({
  name: "error-bar-chart",
  type: "registry:ui",
  categories: ["chart"],
  description:
    "React mirror of @uipkge/error-bar-chart — see the Vue registry item for the canonical description.",
  files: [
    {
      path: "ErrorBarChart.tsx",
      target: "components/ui/charts/error-bar-chart/ErrorBarChart.tsx",
    },
    {
      path: "index.ts",
      target: "components/ui/charts/error-bar-chart/index.ts",
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
