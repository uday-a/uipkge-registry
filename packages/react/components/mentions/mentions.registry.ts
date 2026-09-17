import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "mentions",
  type: "registry:ui",
  categories: ["form"],
  description:
    "Textarea with trigger-character autocomplete and companion MentionTag with Twitter/X-style hover profile card popup.",
  files: [
    { path: "mentions.tsx", target: "components/ui/mentions/mentions.tsx" },
    {
      path: "mention-tag.tsx",
      target: "components/ui/mentions/mention-tag.tsx",
    },
    {
      path: "caret-position.ts",
      target: "components/ui/mentions/caret-position.ts",
    },
    { path: "index.ts", target: "components/ui/mentions/index.ts" },
  ],
  dependencies: ["lucide-react"],
  registryDependencies: [
    "https://uipkge.dev/r/popover.json",
    "https://uipkge.dev/r/hover-card.json",
    "https://uipkge.dev/r/avatar.json",
  ],
});
