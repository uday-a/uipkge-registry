import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "tour",
  type: "registry:ui",
  categories: ["overlay"],
  framework: "vue",
  description:
    "Multi-step guided overlay walkthrough. Highlights a target element with a dim mask cutout and shows a card next to it. Steps support targets by selector, ref, or function; centered (no-target) steps work as modal-style intros.",
  files: [
    { path: "Tour.vue", target: "components/ui/tour/Tour.vue" },
    { path: "TourMask.vue", target: "components/ui/tour/TourMask.vue" },
    { path: "TourCard.vue", target: "components/ui/tour/TourCard.vue" },
    {
      path: "use-tour-target.ts",
      target: "components/ui/tour/use-tour-target.ts",
    },
    { path: "index.ts", target: "components/ui/tour/index.ts" },
  ],
  dependencies: ["lucide-vue-next"],
  registryDependencies: ["https://uipkge.dev/r/button.json"],
});
