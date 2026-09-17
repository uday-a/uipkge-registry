import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "kanban",
  type: "registry:ui",
  categories: ["data-display", "layout"],
  description:
    "Composable compound Kanban primitive for building board, pipeline, and agile workflows with tactile card drag-and-drop mechanics.",
  framework: "react",
  files: [
    { path: "Kanban.tsx", target: "components/ui/kanban/Kanban.tsx" },
    {
      path: "kanban.variants.ts",
      target: "components/ui/kanban/kanban.variants.ts",
    },
    { path: "index.ts", target: "components/ui/kanban/index.ts" },
  ],
  dependencies: ["class-variance-authority", "lucide-react"],
  registryDependencies: ["https://uipkge.dev/r/utils.json"],
});
