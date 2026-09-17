import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "select",
  type: "registry:ui",
  categories: ["control"],
  description:
    "Dropdown select primitive — single-select with optional groups, per-item descriptions, Radix UI popover mode, and zero-JS styled NativeSelect for lightweight/mobile use.",
  files: [
    { path: "select.tsx", target: "components/ui/select/select.tsx" },
    {
      path: "NativeSelect.tsx",
      target: "components/ui/select/NativeSelect.tsx",
    },
    { path: "index.ts", target: "components/ui/select/index.ts" },
  ],
  dependencies: ["@radix-ui/react-select", "lucide-react"],
  registryDependencies: [],
});
