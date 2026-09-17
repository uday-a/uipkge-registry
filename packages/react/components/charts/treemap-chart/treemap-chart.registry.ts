import { defineRegistryItem } from "../../../lib/define-registry";

export default defineRegistryItem({
  name: "treemap-chart",
  type: "registry:ui",
  categories: ["chart"],
  description:
    "React mirror of @uipkge/treemap-chart — see the Vue registry item for the canonical description.",
  files: [
    {
      path: "TreemapChart.tsx",
      target: "components/ui/charts/treemap-chart/TreemapChart.tsx",
    },
    { path: "index.ts", target: "components/ui/charts/treemap-chart/index.ts" },
    {
      path: "../useChartTheme.ts",
      target: "components/ui/charts/useChartTheme.ts",
    },
    { path: "../shared.tsx", target: "components/ui/charts/shared.tsx" },
  ],
  dependencies: ["echarts", "echarts-for-react"],
  registryDependencies: [],
});
