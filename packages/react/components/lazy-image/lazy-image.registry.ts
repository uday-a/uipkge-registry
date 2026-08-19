import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "lazy-image",
  type: "registry:ui",
  categories: ["data-display"],
  description:
    'Lazy-loaded image with aspect-ratio reservation, skeleton placeholder, fade-in transition, and error fallback. Composes loading="lazy" with IntersectionObserver for off-viewport hold and pairs with the skeleton primitive for the placeholder state.',
  files: [
    { path: "Img.tsx", target: "components/ui/lazy-image/Img.tsx" },
    { path: "index.ts", target: "components/ui/lazy-image/index.ts" },
  ],
  dependencies: [],
  registryDependencies: ["https://uipkge.dev/r/skeleton.json"],
});
