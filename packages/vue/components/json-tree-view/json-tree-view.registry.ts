import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "json-tree-view",
  type: "registry:ui",
  categories: ["display", "data"],
  framework: "vue",
  description:
    "Collapsible JSON tree viewer with color-coded value types, click-to-copy, live search/filter, and expand/collapse-all controls. Renders objects, arrays, and primitives with configurable depth and contained scrolling.",
  files: [
    {
      path: "JsonTreeView.vue",
      target: "components/ui/json-tree-view/JsonTreeView.vue",
    },
    {
      path: "JsonTreeNode.vue",
      target: "components/ui/json-tree-view/JsonTreeNode.vue",
    },
    { path: "types.ts", target: "components/ui/json-tree-view/types.ts" },
    { path: "index.ts", target: "components/ui/json-tree-view/index.ts" },
  ],
  dependencies: ["lucide-vue-next"],
  registryDependencies: [],
});
