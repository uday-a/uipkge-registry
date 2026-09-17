import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "xml-tree-view",
  type: "registry:ui",
  categories: ["display", "data"],
  framework: "vue",
  description:
    "Collapsible XML tree viewer with color-coded tags and attributes, click-to-copy, live search/filter, and expand/collapse-all controls. Parses XML strings and renders elements, text, comments, and CDATA with contained scrolling.",
  files: [
    {
      path: "XmlTreeView.vue",
      target: "components/ui/xml-tree-view/XmlTreeView.vue",
    },
    {
      path: "XmlTreeNode.vue",
      target: "components/ui/xml-tree-view/XmlTreeNode.vue",
    },
    { path: "types.ts", target: "components/ui/xml-tree-view/types.ts" },
    { path: "index.ts", target: "components/ui/xml-tree-view/index.ts" },
  ],
  dependencies: ["lucide-vue-next"],
  registryDependencies: [],
});
