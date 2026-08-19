import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "virtual-list",
  type: "registry:ui",
  categories: ["data-display"],
  description:
    "Generic windowed scroller. Renders only visible items plus a small overscan, with fixed or dynamic item sizes. Use for long lists where most rows are off-screen.",
  files: [
    {
      path: "virtual-list.tsx",
      target: "components/ui/virtual-list/virtual-list.tsx",
    },
    { path: "index.ts", target: "components/ui/virtual-list/index.ts" },
  ],
  dependencies: ["@tanstack/react-virtual"],
  registryDependencies: [],
});
