import { defineRegistryItem } from "../../../lib/define-registry";

export default defineRegistryItem({
  name: "sunburst-chart",
  type: "registry:ui",
  categories: ["chart"],
  description:
    "React mirror of @uipkge/sunburst-chart — see the Vue registry item for the canonical description.",
  files: [
    {
      path: "SunburstChart.tsx",
      target: "components/ui/charts/sunburst-chart/SunburstChart.tsx",
    },
    {
      path: "index.ts",
      target: "components/ui/charts/sunburst-chart/index.ts",
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
