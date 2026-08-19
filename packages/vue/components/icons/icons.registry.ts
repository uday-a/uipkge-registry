import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "icons",
  type: "registry:ui",
  categories: ["data-display"],
  framework: "vue",
  description:
    "Showcase + recipe page for the registry’s default icon set (Lucide). Not a runtime component — install the npm package directly. Documented here so consumers can browse names and import recipes.",
  files: [
    { path: "Icon.vue", target: "components/ui/icons/Icon.vue" },
    { path: "index.ts", target: "components/ui/icons/index.ts" },
  ],
  dependencies: [],
  registryDependencies: [],
});
