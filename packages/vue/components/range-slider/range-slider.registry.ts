import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "range-slider",
  type: "registry:ui",
  categories: ["form"],
  framework: "vue",
  description:
    'Two-thumb range slider for "between X and Y" inputs — price filters, age ranges, time windows. Built on reka-ui with proper keyboard handling and aria-valuetext.',
  files: [
    {
      path: "RangeSlider.vue",
      target: "components/ui/range-slider/RangeSlider.vue",
    },
    { path: "index.ts", target: "components/ui/range-slider/index.ts" },
  ],
  dependencies: ["@vueuse/core", "reka-ui"],
  registryDependencies: [],
});
