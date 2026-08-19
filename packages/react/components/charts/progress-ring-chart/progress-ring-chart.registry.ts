import { defineRegistryItem } from "../../../lib/define-registry";

export default defineRegistryItem({
  name: "progress-ring-chart",
  type: "registry:ui",
  categories: ["chart"],
  description:
    "React mirror of @uipkge/progress-ring-chart — see the Vue registry item for the canonical description.",
  files: [
    {
      path: "ProgressRingChart.tsx",
      target: "components/ui/charts/progress-ring-chart/ProgressRingChart.tsx",
    },
    {
      path: "index.ts",
      target: "components/ui/charts/progress-ring-chart/index.ts",
    },
    { path: "../shared.tsx", target: "components/ui/charts/shared.tsx" },
  ],
  dependencies: ["echarts", "echarts-for-react"],
  registryDependencies: [],
});
