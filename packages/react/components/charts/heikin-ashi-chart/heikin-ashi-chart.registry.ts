import { defineRegistryItem } from "../../../lib/define-registry";

export default defineRegistryItem({
  name: "heikin-ashi-chart",
  type: "registry:ui",
  categories: ["chart"],
  description:
    "React mirror of @uipkge/heikin-ashi-chart — see the Vue registry item for the canonical description.",
  files: [
    {
      path: "HeikinAshiChart.tsx",
      target: "components/ui/charts/heikin-ashi-chart/HeikinAshiChart.tsx",
    },
    {
      path: "index.ts",
      target: "components/ui/charts/heikin-ashi-chart/index.ts",
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
