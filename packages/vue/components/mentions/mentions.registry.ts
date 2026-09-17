import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "mentions",
  type: "registry:ui",
  categories: ["form"],
  framework: "vue",
  description:
    "Textarea with trigger-character autocomplete. Type a configured trigger (default @) to open a filtered popover; pick to insert. Static or async options.",
  files: [
    { path: "Mentions.vue", target: "components/ui/mentions/Mentions.vue" },
    {
      path: "caret-position.ts",
      target: "components/ui/mentions/caret-position.ts",
    },
    { path: "index.ts", target: "components/ui/mentions/index.ts" },
  ],
  dependencies: [],
  registryDependencies: ["https://uipkge.dev/r/popover.json"],
});
