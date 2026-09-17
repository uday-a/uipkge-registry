import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "tree-select",
  type: "registry:ui",
  categories: ["control", "form"],
  description:
    "Select from tree-structured data with expand/collapse nodes, single or multi-select with checkboxes, and search filtering. Dropdown shows a nested tree; parent selection cascades to leaf descendants.",
  files: [
    {
      path: "TreeSelect.tsx",
      target: "components/ui/tree-select/TreeSelect.tsx",
    },
    {
      path: "TreeSelectNode.tsx",
      target: "components/ui/tree-select/TreeSelectNode.tsx",
    },
    {
      path: "tree-select.variants.ts",
      target: "components/ui/tree-select/tree-select.variants.ts",
    },
    { path: "types.ts", target: "components/ui/tree-select/types.ts" },
    { path: "index.ts", target: "components/ui/tree-select/index.ts" },
  ],
  dependencies: [
    "lucide-react",
    "@radix-ui/react-popover",
    "@radix-ui/react-slot",
    "class-variance-authority",
  ],
  registryDependencies: ["https://uipkge.dev/r/popover.json"],
});
