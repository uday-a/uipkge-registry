import { defineRegistryItem } from "../../../lib/define-registry";

export default defineRegistryItem({
  name: "alluvial-chart",
  type: "registry:ui",
  categories: ["chart"],
  description:
    "React mirror of @uipkge/alluvial-chart — see the Vue registry item for the canonical description.",
  files: [
    {
      path: "AlluvialChart.tsx",
      target: "components/ui/charts/alluvial-chart/AlluvialChart.tsx",
    },
    {
      path: "index.ts",
      target: "components/ui/charts/alluvial-chart/index.ts",
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
