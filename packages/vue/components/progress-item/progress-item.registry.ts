import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "progress-item",
  type: "registry:ui",
  categories: ["feedback"],
  framework: "vue",
  description:
    "Labeled progress row — item name on the left, progress bar in the middle, percent or count on the right. Use for batched task lists, file upload queues, or onboarding checklists.",
  files: [
    {
      path: "ProgressItem.vue",
      target: "components/ui/progress-item/ProgressItem.vue",
    },
    { path: "index.ts", target: "components/ui/progress-item/index.ts" },
  ],
  dependencies: [],
  registryDependencies: ["https://uipkge.dev/r/progress.json"],
});
