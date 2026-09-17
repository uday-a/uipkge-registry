import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "sheet",
  type: "registry:ui",
  categories: ["overlay"],
  description:
    "Side-mounted modal that slides in from the top, right, bottom, or left edge. Use for filter panels, edit drawers, and mobile menus.",
  files: [
    { path: "sheet.tsx", target: "components/ui/sheet/sheet.tsx" },
    { path: "index.ts", target: "components/ui/sheet/index.ts" },
  ],
  dependencies: ["@radix-ui/react-dialog", "lucide-react"],
  registryDependencies: [],
});
