import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "skeleton",
  type: "registry:ui",
  categories: ["feedback"],
  framework: "vue",
  description:
    "Animated placeholder rectangles for loading states — drop one in shape of the content that’s about to render. Variants for text lines, avatars, rounded rectangles, and circles.",
  files: [
    { path: "Skeleton.vue", target: "components/ui/skeleton/Skeleton.vue" },
    {
      path: "SkeletonGroup.vue",
      target: "components/ui/skeleton/SkeletonGroup.vue",
    },
    {
      path: "SkeletonLoader.vue",
      target: "components/ui/skeleton/SkeletonLoader.vue",
    },
    {
      path: "SkeletonText.vue",
      target: "components/ui/skeleton/SkeletonText.vue",
    },
    {
      path: "skeleton.variants.ts",
      target: "components/ui/skeleton/skeleton.variants.ts",
    },
    { path: "index.ts", target: "components/ui/skeleton/index.ts" },
  ],
  dependencies: ["class-variance-authority"],
  registryDependencies: [],
});
