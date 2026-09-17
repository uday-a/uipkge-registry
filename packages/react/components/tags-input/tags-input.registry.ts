import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "tags-input",
  type: "registry:ui",
  categories: ["form"],
  description:
    "Multi-tag input — type a value, hit Enter, get a Chip. Backspace removes the last tag. Use for email recipient lists, tag sets, and free-form keyword inputs.",
  files: [
    {
      path: "tags-input.tsx",
      target: "components/ui/tags-input/tags-input.tsx",
    },
    { path: "index.ts", target: "components/ui/tags-input/index.ts" },
  ],
  dependencies: ["lucide-react"],
  registryDependencies: [],
});
