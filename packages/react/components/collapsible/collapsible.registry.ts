import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "collapsible",
  type: "registry:ui",
  categories: ["disclosure"],
  description:
    "Headless single-region show/hide primitive. Use it when Accordion is overkill — a single toggle reveals one panel of content. Smooth height animation built in.",
  files: [
    {
      path: "collapsible.tsx",
      target: "components/ui/collapsible/collapsible.tsx",
    },
    { path: "index.ts", target: "components/ui/collapsible/index.ts" },
  ],
  dependencies: ["@radix-ui/react-collapsible"],
  registryDependencies: [],
});
