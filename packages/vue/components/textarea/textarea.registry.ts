import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "textarea",
  type: "registry:ui",
  categories: ["form"],
  framework: "vue",
  description:
    "Multi-line text input. Auto-resize variant, character counter, and the same ring/border treatment as the rest of the form primitives.",
  files: [
    { path: "Textarea.vue", target: "components/ui/textarea/Textarea.vue" },
    { path: "index.ts", target: "components/ui/textarea/index.ts" },
  ],
  dependencies: ["@vueuse/core", "lucide-vue-next", "reka-ui"],
  registryDependencies: ["https://uipkge.dev/r/label.json"],
});
