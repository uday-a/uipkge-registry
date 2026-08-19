import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "tabs",
  type: "registry:ui",
  categories: ["navigation"],
  description:
    "Horizontal tab navigation with content panels — pick one panel at a time. Underline or pills variants. Built on Radix UI with full keyboard navigation.",
  files: [
    { path: "tabs.tsx", target: "components/ui/tabs/tabs.tsx" },
    { path: "tabs.variants.ts", target: "components/ui/tabs/tabs.variants.ts" },
    { path: "index.ts", target: "components/ui/tabs/index.ts" },
  ],
  dependencies: ["@radix-ui/react-tabs", "class-variance-authority"],
  registryDependencies: [],
});
