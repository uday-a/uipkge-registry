import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "vertical-tabs",
  type: "registry:ui",
  categories: ["navigation"],
  framework: "vue",
  description:
    "Settings-page navigation pattern — labels stack on the left, content panel on the right. Same API as Tabs but with a vertical orientation. Use for dense, multi-section settings UIs.",
  files: [
    {
      path: "VerticalTabs.vue",
      target: "components/ui/vertical-tabs/VerticalTabs.vue",
    },
    {
      path: "VerticalTabsList.vue",
      target: "components/ui/vertical-tabs/VerticalTabsList.vue",
    },
    {
      path: "VerticalTabsSection.vue",
      target: "components/ui/vertical-tabs/VerticalTabsSection.vue",
    },
    {
      path: "VerticalTabsTrigger.vue",
      target: "components/ui/vertical-tabs/VerticalTabsTrigger.vue",
    },
    {
      path: "VerticalTabsContent.vue",
      target: "components/ui/vertical-tabs/VerticalTabsContent.vue",
    },
    { path: "index.ts", target: "components/ui/vertical-tabs/index.ts" },
  ],
  dependencies: ["@vueuse/core", "reka-ui"],
  registryDependencies: [],
});
