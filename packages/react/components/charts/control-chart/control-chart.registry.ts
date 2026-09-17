import { defineRegistryItem } from "../../../lib/define-registry";

export default defineRegistryItem({
  name: "control-chart",
  type: "registry:ui",
  categories: ["chart"],
  description:
    "React mirror of @uipkge/control-chart — see the Vue registry item for the canonical description.",
  files: [
    {
      path: "ControlChart.tsx",
      target: "components/ui/charts/control-chart/ControlChart.tsx",
    },
    { path: "index.ts", target: "components/ui/charts/control-chart/index.ts" },
    {
      path: "../useChartTheme.ts",
      target: "components/ui/charts/useChartTheme.ts",
    },
    { path: "../shared.tsx", target: "components/ui/charts/shared.tsx" },
  ],
  dependencies: ["echarts", "echarts-for-react"],
  registryDependencies: [],
});
