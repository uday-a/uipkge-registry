import { defineRegistryItem } from "../../../lib/define-registry";

export default defineRegistryItem({
  name: "beeswarm-chart",
  type: "registry:ui",
  categories: ["chart"],
  description:
    "React mirror of @uipkge/beeswarm-chart — see the Vue registry item for the canonical description.",
  files: [
    {
      path: "BeeswarmChart.tsx",
      target: "components/ui/charts/beeswarm-chart/BeeswarmChart.tsx",
    },
    {
      path: "index.ts",
      target: "components/ui/charts/beeswarm-chart/index.ts",
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
