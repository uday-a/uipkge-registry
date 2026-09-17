import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "slider",
  type: "registry:ui",
  categories: ["form"],
  description:
    "Single-thumb slider — pick a value within a range. Optional tick marks, step size, and inline value display.",
  files: [
    { path: "Slider.tsx", target: "components/ui/slider/Slider.tsx" },
    { path: "index.ts", target: "components/ui/slider/index.ts" },
  ],
  dependencies: ["@radix-ui/react-slider", "@radix-ui/react-tooltip"],
  registryDependencies: [],
});
