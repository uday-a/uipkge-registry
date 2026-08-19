import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "tree-select",
  type: "registry:ui",
  categories: ["control", "form"],
  framework: "vue",
  description:
    "Select from tree-structured data with expand/collapse nodes, single or multi-select with checkboxes, and search filtering. Dropdown shows a nested tree; parent selection cascades to leaf descendants.",
  files: [
    {
      path: "TreeSelect.vue",
      target: "components/ui/tree-select/TreeSelect.vue",
    },
    {
      path: "TreeSelectNode.vue",
      target: "components/ui/tree-select/TreeSelectNode.vue",
    },
    { path: "types.ts", target: "components/ui/tree-select/types.ts" },
    { path: "index.ts", target: "components/ui/tree-select/index.ts" },
  ],
  dependencies: ["lucide-vue-next", "reka-ui"],
  registryDependencies: ["https://uipkge.dev/r/popover.json"],
});
