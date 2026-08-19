import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "slider",
  type: "registry:ui",
  categories: ["form"],
  framework: "vue",
  description:
    "Single-thumb slider — pick a value within a range. Optional tick marks, step size, and inline value display.",
  files: [
    { path: "Slider.vue", target: "components/ui/slider/Slider.vue" },
    { path: "index.ts", target: "components/ui/slider/index.ts" },
  ],
  dependencies: ["@vueuse/core", "reka-ui"],
  registryDependencies: [],
});
