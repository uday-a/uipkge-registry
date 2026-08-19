import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "carousel",
  type: "registry:ui",
  categories: ["data-display"],
  description:
    "Horizontal or vertical scroller with previous/next controls. Built on embla-carousel-react (the official shadcn carousel pattern) and wired through a React context. Drop in images, cards, or any custom slide content.",
  files: [
    { path: "carousel.tsx", target: "components/ui/carousel/carousel.tsx" },
    { path: "index.ts", target: "components/ui/carousel/index.ts" },
  ],
  dependencies: ["embla-carousel-react", "lucide-react"],
  registryDependencies: ["https://uipkge.dev/r/button.json"],
});
