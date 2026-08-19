import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "checkbox",
  type: "registry:ui",
  categories: ["form"],
  description:
    "Standalone or in-form binary toggle, built on Radix UI. Supports indeterminate state for tri-state lists, sizes, and proper keyboard / screen-reader behavior. Pair with Label for clickable text.",
  files: [
    { path: "checkbox.tsx", target: "components/ui/checkbox/checkbox.tsx" },
    { path: "index.ts", target: "components/ui/checkbox/index.ts" },
  ],
  dependencies: ["@radix-ui/react-checkbox", "lucide-react"],
  registryDependencies: [],
});
