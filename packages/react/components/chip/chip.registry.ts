import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "chip",
  type: "registry:ui",
  categories: ["data-display"],
  description:
    "Compact, removable tag — typically used inside `tags-input` or as a filter pill. Seven variants (`default`, `filled`, `outlined`, `elevated`, `success`, `warning`, `destructive`), three sizes, and an optional close button.",
  files: [
    { path: "chip.tsx", target: "components/ui/chip/chip.tsx" },
    { path: "chip.variants.ts", target: "components/ui/chip/chip.variants.ts" },
    { path: "index.ts", target: "components/ui/chip/index.ts" },
  ],
  dependencies: ["class-variance-authority", "lucide-react"],
  registryDependencies: [],
});
