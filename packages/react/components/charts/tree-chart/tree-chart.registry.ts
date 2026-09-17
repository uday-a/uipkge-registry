import { defineRegistryItem } from "../../../lib/define-registry";

export default defineRegistryItem({
  name: "tree-chart",
  type: "registry:ui",
  categories: ["chart"],
  description:
    "React mirror of @uipkge/tree-chart — see the Vue registry item for the canonical description.",
  files: [
    {
      path: "TreeChart.tsx",
      target: "components/ui/charts/tree-chart/TreeChart.tsx",
    },
    { path: "index.ts", target: "components/ui/charts/tree-chart/index.ts" },
    {
      path: "../useChartTheme.ts",
      target: "components/ui/charts/useChartTheme.ts",
    },
    { path: "../shared.tsx", target: "components/ui/charts/shared.tsx" },
  ],
  dependencies: ["echarts", "echarts-for-react"],
  registryDependencies: [],
});
