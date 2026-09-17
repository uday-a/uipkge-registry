import { defineRegistryItem } from "../../../lib/define-registry";

export default defineRegistryItem({
  name: "gauge-chart",
  type: "registry:ui",
  categories: ["chart"],
  description:
    "React mirror of @uipkge/gauge-chart — see the Vue registry item for the canonical description.",
  files: [
    {
      path: "GaugeChart.tsx",
      target: "components/ui/charts/gauge-chart/GaugeChart.tsx",
    },
    { path: "index.ts", target: "components/ui/charts/gauge-chart/index.ts" },
    {
      path: "../useChartTheme.ts",
      target: "components/ui/charts/useChartTheme.ts",
    },
    { path: "../shared.tsx", target: "components/ui/charts/shared.tsx" },
  ],
  dependencies: ["echarts", "echarts-for-react"],
  registryDependencies: [],
});
