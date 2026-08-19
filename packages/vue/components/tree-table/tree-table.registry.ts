import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "tree-table",
  type: "registry:ui",
  categories: ["data", "display"],
  framework: "vue",
  description:
    "Hierarchical data table with expandable parent/child rows. Supports tree-structured data, column configuration, expand/collapse with per-level indent, row selection checkboxes, a loading overlay, and an empty state. Built on the existing table primitives.",
  files: [
    { path: "TreeTable.vue", target: "components/ui/tree-table/TreeTable.vue" },
    { path: "types.ts", target: "components/ui/tree-table/types.ts" },
    { path: "index.ts", target: "components/ui/tree-table/index.ts" },
  ],
  dependencies: ["lucide-vue-next"],
  registryDependencies: [
    "https://uipkge.dev/r/table.json",
    "https://uipkge.dev/r/checkbox.json",
    "https://uipkge.dev/r/spinner.json",
  ],
});
