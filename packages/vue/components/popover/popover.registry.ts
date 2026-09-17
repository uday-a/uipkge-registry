import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "popover",
  type: "registry:ui",
  categories: ["overlay"],
  framework: "vue",
  description:
    "Click-triggered floating panel anchored to a trigger element. Supports optional localStorage persistence and configurable dismissal (click-outside, escape, manual). Built on reka-ui with collision detection.",
  files: [
    { path: "Popover.vue", target: "components/ui/popover/Popover.vue" },
    {
      path: "PopoverAnchor.vue",
      target: "components/ui/popover/PopoverAnchor.vue",
    },
    {
      path: "PopoverContent.vue",
      target: "components/ui/popover/PopoverContent.vue",
    },
    {
      path: "PopoverTrigger.vue",
      target: "components/ui/popover/PopoverTrigger.vue",
    },
    { path: "context.ts", target: "components/ui/popover/context.ts" },
    { path: "index.ts", target: "components/ui/popover/index.ts" },
  ],
  dependencies: ["@vueuse/core", "reka-ui"],
  registryDependencies: [],
});
