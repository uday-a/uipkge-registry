import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "alert-modal",
  type: "registry:ui",
  categories: ["overlay"],
  framework: "vue",
  description:
    "Props-driven shortcut for confirm and destructive prompts — pass `title`, `description`, `actionLabel`, and a `tone` and you get a fully styled modal with a leading icon ring, action button, and optional async loading state. Skip it and use Dialog when you need a free-form modal instead.",
  files: [
    {
      path: "AlertModal.vue",
      target: "components/ui/alert-modal/AlertModal.vue",
    },
    { path: "index.ts", target: "components/ui/alert-modal/index.ts" },
  ],
  dependencies: ["lucide-vue-next", "reka-ui"],
  registryDependencies: ["https://uipkge.dev/r/button.json"],
});
