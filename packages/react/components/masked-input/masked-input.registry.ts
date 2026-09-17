import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "masked-input",
  type: "registry:ui",
  categories: ["form"],
  description:
    "Input with a fixed format mask — phone numbers, credit cards, dates, postal codes. Pass a mask string (e.g. `(###) ###-####`) and the input enforces it as the user types. Customizable placeholder character and replacement marker.",
  files: [
    {
      path: "masked-input.tsx",
      target: "components/ui/masked-input/masked-input.tsx",
    },
    { path: "index.ts", target: "components/ui/masked-input/index.ts" },
  ],
  dependencies: [],
  registryDependencies: [],
});
