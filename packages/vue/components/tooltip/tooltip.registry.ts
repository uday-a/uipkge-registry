import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "tooltip",
  type: "registry:ui",
  categories: ["overlay"],
  framework: "vue",
  description:
    "Small popover triggered by hover/focus, used for short labels — icon-button names, abbreviation expansions, keyboard shortcuts. Auto-positions and respects `prefers-reduced-motion`.",
  files: [
    { path: "Tooltip.vue", target: "components/ui/tooltip/Tooltip.vue" },
    {
      path: "TooltipContent.vue",
      target: "components/ui/tooltip/TooltipContent.vue",
    },
    {
      path: "TooltipProvider.vue",
      target: "components/ui/tooltip/TooltipProvider.vue",
    },
    {
      path: "TooltipTrigger.vue",
      target: "components/ui/tooltip/TooltipTrigger.vue",
    },
    { path: "index.ts", target: "components/ui/tooltip/index.ts" },
  ],
  dependencies: ["@vueuse/core", "reka-ui"],
  registryDependencies: [],
});
