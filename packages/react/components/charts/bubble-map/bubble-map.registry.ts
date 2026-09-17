import { defineRegistryItem } from "../../../lib/define-registry";

export default defineRegistryItem({
  name: "bubble-map",
  type: "registry:ui",
  framework: "react",
  categories: ["chart"],
  description:
    "Proportional symbol bubble map as dependency-free SVG. Eliminates geographic landmass distortion by scaling circle areas to continuous quantitative values with mathematical square-root radius normalization, pulsating concentric ripple rings, multi-tier size legend, and interactive hover cards.",
  files: [
    {
      path: "BubbleMap.tsx",
      target: "components/ui/charts/bubble-map/BubbleMap.tsx",
    },
    { path: "index.ts", target: "components/ui/charts/bubble-map/index.ts" },
  ],
  dependencies: ["lucide-react"],
  registryDependencies: ["https://uipkge.dev/r/map.json"],
});
