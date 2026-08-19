import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "theme-switch",
  type: "registry:ui",
  categories: ["action"],
  description:
    "Light / dark / system theme toggle — drop in the header. Seven visual variants: `cards`, `icons`, `icon-only`, `dropdown`, `pill`, `pill-4`, and `switch`. Persists choice to `localStorage` and respects `prefers-color-scheme` for `system`.",
  files: [
    {
      path: "theme-switch.tsx",
      target: "components/ui/theme-switch/theme-switch.tsx",
    },
    { path: "index.ts", target: "components/ui/theme-switch/index.ts" },
  ],
  dependencies: ["next-themes", "lucide-react"],
  registryDependencies: [
    "https://uipkge.dev/r/section-card.json",
    "https://uipkge.dev/r/dropdown-menu.json",
  ],
});
