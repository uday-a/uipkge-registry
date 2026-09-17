import { defineRegistryItem } from "../../lib/define-registry";

// Env-aware host so local builds (REGISTRY_SITE=http://localhost:…) emit
// Env-aware host; build.ts injects the /react/ segment on output.
const SITE = process.env.REGISTRY_SITE ?? "https://uipkge.dev";

export default defineRegistryItem({
  name: "dialog",
  type: "registry:ui",
  categories: ["overlay"],
  description:
    "Free-form modal primitive — composable from `Dialog`, `DialogTrigger`, `DialogContent`, and friends. Use for forms, info cards, pickers, and any custom modal layout. For confirm/destructive prompts, prefer the prebuilt `AlertModal` shortcut.",
  files: [
    { path: "dialog.tsx", target: "components/ui/dialog/dialog.tsx" },
    { path: "index.ts", target: "components/ui/dialog/index.ts" },
  ],
  dependencies: ["@radix-ui/react-dialog", "lucide-react"],
  // DialogFooter composes Button, so installing dialog auto-pulls button.
  registryDependencies: ["https://uipkge.dev/r/button.json"],
});
