import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "avatar",
  type: "registry:ui",
  categories: ["data-display"],
  framework: "vue",
  description:
    "Round or rounded-square user image with a fallback that shows initials or an icon when the image is missing or fails to load. Sizes from xs to 2xl, optional status dot, and a group composition for stacked avatar lists.",
  files: [
    { path: "Avatar.vue", target: "components/ui/avatar/Avatar.vue" },
    {
      path: "AvatarFallback.vue",
      target: "components/ui/avatar/AvatarFallback.vue",
    },
    { path: "AvatarGroup.vue", target: "components/ui/avatar/AvatarGroup.vue" },
    { path: "AvatarImage.vue", target: "components/ui/avatar/AvatarImage.vue" },
    {
      path: "avatar.variants.ts",
      target: "components/ui/avatar/avatar.variants.ts",
    },
    { path: "context.ts", target: "components/ui/avatar/context.ts" },
    { path: "index.ts", target: "components/ui/avatar/index.ts" },
  ],
  dependencies: ["class-variance-authority"],
  registryDependencies: [],
});
