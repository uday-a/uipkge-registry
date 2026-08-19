import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "alert",
  type: "registry:ui",
  categories: ["feedback"],
  description:
    "Static, in-flow notice block with a leading icon, title, and description. Use for inline page-level messages — info banners, success confirmations, warning callouts. Two tones: `default` and `destructive`.",
  files: [
    { path: "alert.tsx", target: "components/ui/alert/alert.tsx" },
    {
      path: "alert.variants.ts",
      target: "components/ui/alert/alert.variants.ts",
    },
    { path: "index.ts", target: "components/ui/alert/index.ts" },
  ],
  dependencies: ["class-variance-authority", "lucide-react"],
  registryDependencies: [],
});
