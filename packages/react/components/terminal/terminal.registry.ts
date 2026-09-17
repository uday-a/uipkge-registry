import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "terminal",
  type: "registry:ui",
  categories: ["display"],
  description:
    "Terminal/command-line display with a macOS-style title bar, command history, prompt character, dark/light themes, auto-scroll, optional typing animation, and a line slot for custom formatting.",
  files: [
    { path: "Terminal.tsx", target: "components/ui/terminal/Terminal.tsx" },
    { path: "index.ts", target: "components/ui/terminal/index.ts" },
  ],
  dependencies: [],
  registryDependencies: [],
});
