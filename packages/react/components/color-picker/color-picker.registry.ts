import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "color-picker",
  type: "registry:ui",
  categories: ["form"],
  description:
    "Hex / RGB color input with a popover swatch grid. Supports controlled and uncontrolled modes, alpha channel, and a recent-colors row.",
  files: [
    {
      path: "color-picker.tsx",
      target: "components/ui/color-picker/color-picker.tsx",
    },
    { path: "index.ts", target: "components/ui/color-picker/index.ts" },
  ],
  dependencies: [],
  registryDependencies: [],
});
