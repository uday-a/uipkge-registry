import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "skeleton",
  type: "registry:ui",
  categories: ["feedback"],
  description:
    "Animated placeholder rectangles for loading states — drop one in shape of the content that’s about to render. Variants for text lines, avatars, rounded rectangles, and circles.",
  files: [
    { path: "skeleton.tsx", target: "components/ui/skeleton/skeleton.tsx" },
    {
      path: "skeleton.variants.ts",
      target: "components/ui/skeleton/skeleton.variants.ts",
    },
    { path: "index.ts", target: "components/ui/skeleton/index.ts" },
  ],
  dependencies: ["class-variance-authority"],
  registryDependencies: [],
});
