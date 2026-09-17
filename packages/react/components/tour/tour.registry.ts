import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "tour",
  type: "registry:ui",
  categories: ["overlay"],
  framework: "react",
  description:
    "Multi-step guided overlay walkthrough. Highlights a target element with a dim mask cutout and shows a card next to it. Steps support targets by selector, ref, or function; centered (no-target) steps work as modal-style intros.",
  files: [
    { path: "tour.tsx", target: "components/ui/tour/tour.tsx" },
    { path: "index.ts", target: "components/ui/tour/index.ts" },
  ],
  dependencies: ["lucide-react"],
  registryDependencies: ["https://uipkge.dev/r/button.json"],
});
