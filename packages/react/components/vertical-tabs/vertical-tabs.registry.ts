import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "vertical-tabs",
  type: "registry:ui",
  categories: ["navigation"],
  description:
    "Settings-page navigation pattern — labels stack on the left, content panel on the right. Same API as Tabs but with a vertical orientation. Use for dense, multi-section settings UIs.",
  files: [
    {
      path: "vertical-tabs.tsx",
      target: "components/ui/vertical-tabs/vertical-tabs.tsx",
    },
    { path: "index.ts", target: "components/ui/vertical-tabs/index.ts" },
  ],
  dependencies: ["@radix-ui/react-tabs"],
  registryDependencies: [],
});
