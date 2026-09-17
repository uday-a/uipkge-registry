import { defineRegistryItem } from "../../../lib/define-registry";

export default defineRegistryItem({
  name: "smooth-funnel",
  type: "registry:ui",
  framework: "vue",
  categories: ["chart"],
  description:
    "Smoothly tapering SVG funnel with cubic-bezier transitions between stages. Pure SVG (no ECharts). Each stage is colored independently and shows its own percent pill; a minHeight floor keeps tail stages visible at tiny percents.",
  files: [
    {
      path: "SmoothFunnel.vue",
      target: "components/ui/charts/smooth-funnel/SmoothFunnel.vue",
    },
    { path: "index.ts", target: "components/ui/charts/smooth-funnel/index.ts" },
  ],
  dependencies: [],
  registryDependencies: [],
});
