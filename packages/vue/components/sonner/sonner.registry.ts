import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "sonner",
  type: "registry:ui",
  categories: ["feedback"],
  framework: "vue",
  description:
    "Toast notification system — non-blocking, auto-dismissing alerts that stack in a corner. Built on the `vue-sonner` library with the registry’s tokens applied.",
  files: [
    { path: "Sonner.vue", target: "components/ui/sonner/Sonner.vue" },
    { path: "index.ts", target: "components/ui/sonner/index.ts" },
  ],
  dependencies: ["lucide-vue-next", "vue-sonner"],
  registryDependencies: [],
});
