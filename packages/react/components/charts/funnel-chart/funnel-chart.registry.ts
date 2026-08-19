import { defineRegistryItem } from "../../../lib/define-registry";

export default defineRegistryItem({
  name: "funnel-chart",
  type: "registry:ui",
  categories: ["chart"],
  description:
    "React mirror of @uipkge/funnel-chart — see the Vue registry item for the canonical description.",
  files: [
    {
      path: "FunnelChart.tsx",
      target: "components/ui/charts/funnel-chart/FunnelChart.tsx",
    },
    { path: "index.ts", target: "components/ui/charts/funnel-chart/index.ts" },
    {
      path: "../useChartTheme.ts",
      target: "components/ui/charts/useChartTheme.ts",
    },
    { path: "../shared.tsx", target: "components/ui/charts/shared.tsx" },
  ],
  dependencies: ["echarts", "echarts-for-react"],
  registryDependencies: [],
});
