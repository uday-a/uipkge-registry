import { defineRegistryItem } from "../../../lib/define-registry";

export default defineRegistryItem({
  name: "pie-chart",
  type: "registry:ui",
  categories: ["chart"],
  description:
    "React mirror of @uipkge/pie-chart — see the Vue registry item for the canonical description.",
  files: [
    {
      path: "PieChart.tsx",
      target: "components/ui/charts/pie-chart/PieChart.tsx",
    },
    { path: "index.ts", target: "components/ui/charts/pie-chart/index.ts" },
    {
      path: "../useChartTheme.ts",
      target: "components/ui/charts/useChartTheme.ts",
    },
    { path: "../shared.tsx", target: "components/ui/charts/shared.tsx" },
  ],
  dependencies: ["echarts", "echarts-for-react"],
  registryDependencies: [],
});
