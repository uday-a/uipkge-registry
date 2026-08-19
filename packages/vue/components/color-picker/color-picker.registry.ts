import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "color-picker",
  type: "registry:ui",
  categories: ["form"],
  framework: "vue",
  description:
    "Hex / RGB color input with a popover swatch grid. Supports controlled and uncontrolled modes, alpha channel, and a recent-colors row.",
  files: [
    {
      path: "ColorPicker.vue",
      target: "components/ui/color-picker/ColorPicker.vue",
    },
    { path: "index.ts", target: "components/ui/color-picker/index.ts" },
  ],
  dependencies: [],
  registryDependencies: [],
});
