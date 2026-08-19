import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "toggle-group",
  type: "registry:ui",
  categories: ["action"],
  description:
    'Group of `Toggle` buttons that act as a single-select or multi-select control. Use for view-mode pickers (grid/list), text-format toolbars, and any "pick one of N" button bar.',
  files: [
    {
      path: "toggle-group.tsx",
      target: "components/ui/toggle-group/toggle-group.tsx",
    },
    { path: "index.ts", target: "components/ui/toggle-group/index.ts" },
  ],
  dependencies: ["class-variance-authority", "@radix-ui/react-toggle-group"],
  registryDependencies: ["https://uipkge.dev/r/toggle.json"],
});
