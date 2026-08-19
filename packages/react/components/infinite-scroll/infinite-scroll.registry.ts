import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "infinite-scroll",
  type: "registry:ui",
  categories: ["utility", "data"],
  description:
    "Load-more-on-scroll sentinel. Calls an onLoadMore callback when the user scrolls near the bottom (or top, in reverse mode). Supports a window or element scroll target, distance threshold, loading/hasMore/disabled gating, and slots for custom loading and end-of-list states.",
  files: [
    {
      path: "InfiniteScroll.tsx",
      target: "components/ui/infinite-scroll/InfiniteScroll.tsx",
    },
    { path: "index.ts", target: "components/ui/infinite-scroll/index.ts" },
  ],
  dependencies: ["lucide-react"],
  registryDependencies: [],
});
