import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "tabs",
  type: "registry:ui",
  categories: ["navigation"],
  framework: "vue",
  description:
    "Horizontal tab navigation with content panels — pick one panel at a time. Underline or pills variants. Built on reka-ui with full keyboard navigation.",
  files: [
    { path: "Tabs.vue", target: "components/ui/tabs/Tabs.vue" },
    { path: "TabsContent.vue", target: "components/ui/tabs/TabsContent.vue" },
    { path: "TabsList.vue", target: "components/ui/tabs/TabsList.vue" },
    { path: "TabsTrigger.vue", target: "components/ui/tabs/TabsTrigger.vue" },
    { path: "tabs.variants.ts", target: "components/ui/tabs/tabs.variants.ts" },
    { path: "index.ts", target: "components/ui/tabs/index.ts" },
  ],
  dependencies: ["@vueuse/core", "class-variance-authority", "reka-ui"],
  registryDependencies: [],
});
