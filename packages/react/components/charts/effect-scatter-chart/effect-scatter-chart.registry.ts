import { defineRegistryItem } from "../../../lib/define-registry";

export default defineRegistryItem({
  name: "effect-scatter-chart",
  type: "registry:ui",
  categories: ["chart"],
  description:
    "React mirror of @uipkge/effect-scatter-chart — see the Vue registry item for the canonical description.",
  files: [
    {
      path: "EffectScatterChart.tsx",
      target:
        "components/ui/charts/effect-scatter-chart/EffectScatterChart.tsx",
    },
    {
      path: "index.ts",
      target: "components/ui/charts/effect-scatter-chart/index.ts",
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
