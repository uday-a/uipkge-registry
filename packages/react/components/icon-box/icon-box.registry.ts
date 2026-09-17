import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "icon-box",
  type: "registry:ui",
  categories: ["data-display"],
  description:
    "Icon container primitive with calibrated sizes (2xs to xl), surface variants (solid, outline, subtle, primary, muted), and 2.5D layered IconStack for empty states and feature hero cards.",
  files: [
    { path: "icon-box.tsx", target: "components/ui/icon-box/icon-box.tsx" },
    { path: "IconStack.tsx", target: "components/ui/icon-box/IconStack.tsx" },
    { path: "index.ts", target: "components/ui/icon-box/index.ts" },
  ],
  dependencies: [],
  registryDependencies: [],
});
