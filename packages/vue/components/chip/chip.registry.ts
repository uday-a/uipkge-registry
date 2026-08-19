import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "chip",
  type: "registry:ui",
  categories: ["data-display"],
  framework: "vue",
  description:
    "Compact, removable tag — typically used inside `tags-input` or as a filter pill. Seven variants (`default`, `filled`, `outlined`, `elevated`, `success`, `warning`, `destructive`), three sizes, and an optional close button.",
  files: [
    { path: "Chip.vue", target: "components/ui/chip/Chip.vue" },
    { path: "ChipGroup.vue", target: "components/ui/chip/ChipGroup.vue" },
    { path: "chip.variants.ts", target: "components/ui/chip/chip.variants.ts" },
    { path: "index.ts", target: "components/ui/chip/index.ts" },
  ],
  dependencies: ["class-variance-authority", "lucide-vue-next"],
  registryDependencies: [],
});
