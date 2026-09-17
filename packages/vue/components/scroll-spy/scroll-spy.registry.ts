import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "scroll-spy",
  type: "registry:ui",
  title: "ScrollSpy",
  description:
    "In-page navigation list with scroll-spy. Renders a vertical list of links; the active item highlights as the user scrolls through anchored sections.",
  categories: ["navigation"],
  framework: "vue",
  files: [
    { path: "ScrollSpy.vue", target: "components/ui/scroll-spy/ScrollSpy.vue" },
    {
      path: "ScrollSpyIndicator.vue",
      target: "components/ui/scroll-spy/ScrollSpyIndicator.vue",
    },
    {
      path: "ScrollSpyItem.vue",
      target: "components/ui/scroll-spy/ScrollSpyItem.vue",
    },
    {
      path: "ScrollSpyLink.vue",
      target: "components/ui/scroll-spy/ScrollSpyLink.vue",
    },
    {
      path: "ScrollSpyList.vue",
      target: "components/ui/scroll-spy/ScrollSpyList.vue",
    },
    {
      path: "ScrollSpyTitle.vue",
      target: "components/ui/scroll-spy/ScrollSpyTitle.vue",
    },
    {
      path: "ScrollSpyStepper.vue",
      target: "components/ui/scroll-spy/ScrollSpyStepper.vue",
    },
    { path: "context.ts", target: "components/ui/scroll-spy/context.ts" },
    { path: "index.ts", target: "components/ui/scroll-spy/index.ts" },
  ],
  dependencies: ["lucide-vue-next"],
  registryDependencies: [],
});
