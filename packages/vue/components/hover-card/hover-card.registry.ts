import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "hover-card",
  type: "registry:ui",
  categories: ["overlay"],
  framework: "vue",
  description:
    "Rich popover triggered by hover/focus instead of click. Use for inline previews — user cards on @mentions, link previews, KPI explanations. Built on reka-ui with a configurable open/close delay.",
  files: [
    { path: "HoverCard.vue", target: "components/ui/hover-card/HoverCard.vue" },
    {
      path: "HoverCardContent.vue",
      target: "components/ui/hover-card/HoverCardContent.vue",
    },
    {
      path: "HoverCardTrigger.vue",
      target: "components/ui/hover-card/HoverCardTrigger.vue",
    },
    { path: "index.ts", target: "components/ui/hover-card/index.ts" },
  ],
  dependencies: ["@vueuse/core", "reka-ui"],
  registryDependencies: [],
});
