import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "grid",
  type: "registry:ui",
  categories: ["layout"],
  framework: "vue",
  description:
    "Responsive CSS grid container with `cols`, `gap`, and breakpoint props. A small but useful primitive for laying out card grids, KPI tiles, and form sections without writing repetitive Tailwind classes.",
  files: [
    { path: "Grid.vue", target: "components/ui/grid/Grid.vue" },
    { path: "index.ts", target: "components/ui/grid/index.ts" },
  ],
  dependencies: [],
  registryDependencies: [],
});
