import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "range-slider",
  type: "registry:ui",
  categories: ["form"],
  description:
    'Two-thumb range slider for "between X and Y" inputs — price filters, age ranges, time windows. Built on @radix-ui/react-slider with proper keyboard handling and aria-valuetext.',
  files: [
    {
      path: "RangeSlider.tsx",
      target: "components/ui/range-slider/RangeSlider.tsx",
    },
    { path: "index.ts", target: "components/ui/range-slider/index.ts" },
  ],
  dependencies: ["@radix-ui/react-slider"],
  registryDependencies: [],
});
