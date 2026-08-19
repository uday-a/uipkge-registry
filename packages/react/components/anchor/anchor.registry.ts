import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "anchor",
  type: "registry:ui",
  categories: ["navigation"],
  description:
    "In-page navigation list with scroll-spy. Renders a vertical list of links; the active item highlights as the user scrolls through anchored sections.",
  files: [
    { path: "anchor.tsx", target: "components/ui/anchor/anchor.tsx" },
    { path: "index.ts", target: "components/ui/anchor/index.ts" },
  ],
  dependencies: [],
  registryDependencies: [],
});
