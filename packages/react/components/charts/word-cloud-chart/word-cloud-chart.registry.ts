import { defineRegistryItem } from "../../../lib/define-registry";

export default defineRegistryItem({
  name: "word-cloud-chart",
  type: "registry:ui",
  categories: ["chart"],
  description:
    "React mirror of @uipkge/word-cloud-chart — see the Vue registry item for the canonical description.",
  files: [
    {
      path: "WordCloudChart.tsx",
      target: "components/ui/charts/word-cloud-chart/WordCloudChart.tsx",
    },
    {
      path: "index.ts",
      target: "components/ui/charts/word-cloud-chart/index.ts",
    },
    { path: "../shared.tsx", target: "components/ui/charts/shared.tsx" },
  ],
  dependencies: ["echarts", "echarts-for-react"],
  registryDependencies: [],
});
