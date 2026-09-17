import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "accordion",
  type: "registry:ui",
  categories: ["disclosure"],
  description:
    "Vertically stacked, collapsible panels — one or many open at a time. Use for FAQs, settings groups, and any place where space is tight but content needs to stay browsable. Built on Radix UI with smooth animation and full keyboard support.",
  files: [
    { path: "accordion.tsx", target: "components/ui/accordion/accordion.tsx" },
    {
      path: "accordion.variants.ts",
      target: "components/ui/accordion/accordion.variants.ts",
    },
    { path: "index.ts", target: "components/ui/accordion/index.ts" },
  ],
  dependencies: [
    "@radix-ui/react-accordion",
    "class-variance-authority",
    "lucide-react",
  ],
  registryDependencies: [],
});
