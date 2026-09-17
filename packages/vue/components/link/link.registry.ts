import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "link",
  type: "registry:ui",
  categories: ["navigation"],
  framework: "vue",
  description:
    "Styled anchor with router integration. Renders an <a> for href, a router-link for to, and handles external links with target/rel. Supports underline variants (always/hover/none), color variants (default/primary/muted), disabled state, left/right icon slots, size variants, and asChild composition.",
  files: [
    { path: "Link.vue", target: "components/ui/link/Link.vue" },
    { path: "link.variants.ts", target: "components/ui/link/link.variants.ts" },
    { path: "index.ts", target: "components/ui/link/index.ts" },
  ],
  dependencies: ["class-variance-authority", "reka-ui"],
  registryDependencies: [],
});
