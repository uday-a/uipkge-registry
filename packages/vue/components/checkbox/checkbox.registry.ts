import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "checkbox",
  type: "registry:ui",
  categories: ["form"],
  framework: "vue",
  description:
    "Standalone or in-form binary toggle, built on reka-ui. Supports indeterminate state for tri-state lists, sizes, and proper keyboard / screen-reader behavior. Pair with Label for clickable text.",
  files: [
    { path: "Checkbox.vue", target: "components/ui/checkbox/Checkbox.vue" },
    {
      path: "CheckboxGroup.vue",
      target: "components/ui/checkbox/CheckboxGroup.vue",
    },
    { path: "index.ts", target: "components/ui/checkbox/index.ts" },
  ],
  dependencies: ["@vueuse/core", "lucide-vue-next", "reka-ui"],
  registryDependencies: [],
});
