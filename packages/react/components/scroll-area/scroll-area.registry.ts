import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "scroll-area",
  type: "registry:ui",
  categories: ["layout"],
  description:
    "Custom scrollbar that always renders the same way across OSes (no flashing native scrollbars on Windows). Use for sidebars, dropdown content, and any overflow region you want to feel consistent.",
  files: [
    {
      path: "scroll-area.tsx",
      target: "components/ui/scroll-area/scroll-area.tsx",
    },
    { path: "index.ts", target: "components/ui/scroll-area/index.ts" },
  ],
  dependencies: ["@radix-ui/react-scroll-area"],
  registryDependencies: [],
});
