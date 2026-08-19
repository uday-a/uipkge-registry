import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "kbd",
  type: "registry:ui",
  categories: ["data-display"],
  description:
    "Inline keyboard-key indicator — renders a single key or shortcut in monospace with a subtle bordered chip.",
  files: [
    { path: "kbd.tsx", target: "components/ui/kbd/kbd.tsx" },
    { path: "index.ts", target: "components/ui/kbd/index.ts" },
  ],
  dependencies: [],
  registryDependencies: [],
});
