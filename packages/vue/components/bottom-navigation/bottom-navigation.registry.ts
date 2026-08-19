import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "bottom-navigation",
  type: "registry:ui",
  categories: ["navigation"],
  framework: "vue",
  description:
    "Mobile bottom tab bar with icon + label items. Supports v-model for the active item, an active color, fixed positioning at the viewport bottom, badges on items, and a `to` prop for vue-router integration.",
  files: [
    {
      path: "BottomNavigation.vue",
      target: "components/ui/bottom-navigation/BottomNavigation.vue",
    },
    { path: "index.ts", target: "components/ui/bottom-navigation/index.ts" },
  ],
  dependencies: ["lucide-vue-next"],
  registryDependencies: [],
});
