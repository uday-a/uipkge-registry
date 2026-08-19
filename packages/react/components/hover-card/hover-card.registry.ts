import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "hover-card",
  type: "registry:ui",
  categories: ["overlay"],
  description:
    "Rich popover triggered by hover/focus instead of click. Use for inline previews — user cards on @mentions, link previews, KPI explanations. Built on reka-ui with a configurable open/close delay.",
  files: [
    {
      path: "hover-card.tsx",
      target: "components/ui/hover-card/hover-card.tsx",
    },
    { path: "index.ts", target: "components/ui/hover-card/index.ts" },
  ],
  dependencies: ["@radix-ui/react-hover-card"],
  registryDependencies: [],
});
