import { defineRegistryItem } from "../../../lib/define-registry";

export default defineRegistryItem({
  name: "violin-chart",
  type: "registry:ui",
  categories: ["chart"],
  description:
    "React mirror of @uipkge/violin-chart — see the Vue registry item for the canonical description.",
  files: [
    {
      path: "ViolinChart.tsx",
      target: "components/ui/charts/violin-chart/ViolinChart.tsx",
    },
    { path: "index.ts", target: "components/ui/charts/violin-chart/index.ts" },
    {
      path: "../useChartTheme.ts",
      target: "components/ui/charts/useChartTheme.ts",
    },
    { path: "../shared.tsx", target: "components/ui/charts/shared.tsx" },
  ],
  dependencies: ["echarts", "echarts-for-react"],
  registryDependencies: [],
});
