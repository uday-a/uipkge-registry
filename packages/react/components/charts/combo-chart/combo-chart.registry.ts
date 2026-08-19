import { defineRegistryItem } from "../../../lib/define-registry";

export default defineRegistryItem({
  name: "combo-chart",
  type: "registry:ui",
  categories: ["chart"],
  description:
    "React mirror of @uipkge/combo-chart — see the Vue registry item for the canonical description.",
  files: [
    {
      path: "ComboChart.tsx",
      target: "components/ui/charts/combo-chart/ComboChart.tsx",
    },
    { path: "index.ts", target: "components/ui/charts/combo-chart/index.ts" },
    {
      path: "../useChartTheme.ts",
      target: "components/ui/charts/useChartTheme.ts",
    },
    { path: "../shared.tsx", target: "components/ui/charts/shared.tsx" },
  ],
  dependencies: ["echarts", "echarts-for-react"],
  registryDependencies: [],
});
