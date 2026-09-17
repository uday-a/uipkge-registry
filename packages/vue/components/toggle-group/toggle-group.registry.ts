import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "toggle-group",
  type: "registry:ui",
  categories: ["action"],
  framework: "vue",
  description:
    'Group of `Toggle` buttons that act as a single-select or multi-select control. Use for view-mode pickers (grid/list), text-format toolbars, and any "pick one of N" button bar.',
  files: [
    {
      path: "ToggleGroup.vue",
      target: "components/ui/toggle-group/ToggleGroup.vue",
    },
    {
      path: "ToggleGroupItem.vue",
      target: "components/ui/toggle-group/ToggleGroupItem.vue",
    },
    { path: "index.ts", target: "components/ui/toggle-group/index.ts" },
  ],
  dependencies: ["@vueuse/core", "class-variance-authority", "reka-ui"],
  registryDependencies: ["https://uipkge.dev/r/toggle.json"],
});
