import { defineRegistryItem } from "../../../lib/define-registry";

export default defineRegistryItem({
  name: "candlestick-chart",
  type: "registry:ui",
  categories: ["chart"],
  description:
    "React mirror of @uipkge/candlestick-chart — see the Vue registry item for the canonical description.",
  files: [
    {
      path: "CandlestickChart.tsx",
      target: "components/ui/charts/candlestick-chart/CandlestickChart.tsx",
    },
    {
      path: "index.ts",
      target: "components/ui/charts/candlestick-chart/index.ts",
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
