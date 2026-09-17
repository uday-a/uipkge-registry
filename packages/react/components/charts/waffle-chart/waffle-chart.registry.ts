import { defineRegistryItem } from "../../../lib/define-registry";

export default defineRegistryItem({
  name: "waffle-chart",
  type: "registry:ui",
  categories: ["chart"],
  description:
    "React mirror of @uipkge/waffle-chart — see the Vue registry item for the canonical description.",
  files: [
    {
      path: "WaffleChart.tsx",
      target: "components/ui/charts/waffle-chart/WaffleChart.tsx",
    },
    { path: "index.ts", target: "components/ui/charts/waffle-chart/index.ts" },
    { path: "../shared.tsx", target: "components/ui/charts/shared.tsx" },
  ],
  dependencies: ["echarts", "echarts-for-react"],
  registryDependencies: [],
});
