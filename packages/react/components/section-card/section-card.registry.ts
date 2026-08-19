import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "section-card",
  type: "registry:ui",
  categories: ["layout"],
  description:
    "Card variant tuned for settings pages — title, description, and content slots, with optional footer for save/cancel actions. The block-level building block for `.../settings/*` routes.",
  files: [
    {
      path: "section-card.tsx",
      target: "components/ui/section-card/section-card.tsx",
    },
    { path: "index.ts", target: "components/ui/section-card/index.ts" },
  ],
  dependencies: [],
  registryDependencies: ["https://uipkge.dev/r/card.json"],
});
