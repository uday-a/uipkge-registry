import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "number-field",
  type: "registry:ui",
  categories: ["form"],
  description:
    "Numeric input with stepper buttons, min/max bounds, step size, and decimal precision. Use for quantities, prices, and any field that should be a number rather than free text.",
  files: [
    {
      path: "number-field.tsx",
      target: "components/ui/number-field/number-field.tsx",
    },
    { path: "index.ts", target: "components/ui/number-field/index.ts" },
  ],
  dependencies: ["lucide-react"],
  registryDependencies: [],
});
