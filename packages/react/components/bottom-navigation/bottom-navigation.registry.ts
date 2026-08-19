import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "bottom-navigation",
  type: "registry:ui",
  categories: ["navigation"],
  framework: "react",
  description:
    "Mobile bottom tab bar with icon + label items. Supports value/defaultValue for the active item, an active color, fixed positioning at the viewport bottom, badges on items, and a `to` prop for link integration.",
  files: [
    {
      path: "BottomNavigation.tsx",
      target: "components/ui/bottom-navigation/BottomNavigation.tsx",
    },
    { path: "index.ts", target: "components/ui/bottom-navigation/index.ts" },
  ],
  dependencies: ["lucide-react"],
  registryDependencies: [],
});
