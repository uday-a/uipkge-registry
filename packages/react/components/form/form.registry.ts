import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "form",
  type: "registry:ui",
  categories: ["form"],
  description:
    "Zod-first form block built on React Hook Form. Wires field labels, descriptions, error messages, and validation together; bind a field once and the rest is automatic.",
  files: [
    { path: "form.tsx", target: "components/ui/form/form.tsx" },
    { path: "index.ts", target: "components/ui/form/index.ts" },
  ],
  dependencies: ["react-hook-form", "@radix-ui/react-slot", "lucide-react"],
  registryDependencies: ["https://uipkge.dev/r/label.json"],
});
