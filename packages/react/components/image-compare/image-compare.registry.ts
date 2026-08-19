import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "image-compare",
  type: "registry:ui",
  categories: ["display", "media"],
  framework: "react",
  description:
    "Before/after image comparison slider with a draggable divider. Two images overlaid via clip-path, pointer-driven (mouse + touch), horizontal or vertical orientation, custom handle render prop, labels, and disabled state.",
  files: [
    {
      path: "ImageCompare.tsx",
      target: "components/ui/image-compare/ImageCompare.tsx",
    },
    {
      path: "image-compare.variants.ts",
      target: "components/ui/image-compare/image-compare.variants.ts",
    },
    { path: "index.ts", target: "components/ui/image-compare/index.ts" },
  ],
  dependencies: ["class-variance-authority", "lucide-react"],
  registryDependencies: [],
});
