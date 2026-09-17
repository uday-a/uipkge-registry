import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "dropdown-menu",
  type: "registry:ui",
  categories: ["overlay"],
  description:
    "Floating menu launched from a trigger button — for account switchers, row actions, editor menus, and any short list of commands. Supports labels, icons, separators, keyboard shortcuts, checkbox/radio items, and nested submenus. Built on Radix UI; ARIA + keyboard navigation handled.",
  files: [
    {
      path: "dropdown-menu.tsx",
      target: "components/ui/dropdown-menu/dropdown-menu.tsx",
    },
    { path: "index.ts", target: "components/ui/dropdown-menu/index.ts" },
  ],
  dependencies: ["@radix-ui/react-dropdown-menu", "lucide-react"],
  registryDependencies: [],
});
