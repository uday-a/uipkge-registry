import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "navigation-menu",
  type: "registry:ui",
  categories: ["navigation"],
  framework: "vue",
  description:
    "Top-of-page horizontal navigation with hover/click triggered megamenus. Use for marketing sites and product navs that need rich content — featured links, mini-cards, and submenu columns.",
  files: [
    {
      path: "NavigationMenu.vue",
      target: "components/ui/navigation-menu/NavigationMenu.vue",
    },
    {
      path: "NavigationMenuContent.vue",
      target: "components/ui/navigation-menu/NavigationMenuContent.vue",
    },
    {
      path: "navigation-menu-content.variants.ts",
      target:
        "components/ui/navigation-menu/navigation-menu-content.variants.ts",
    },
    {
      path: "NavigationMenuIndicator.vue",
      target: "components/ui/navigation-menu/NavigationMenuIndicator.vue",
    },
    {
      path: "NavigationMenuItem.vue",
      target: "components/ui/navigation-menu/NavigationMenuItem.vue",
    },
    {
      path: "NavigationMenuLink.vue",
      target: "components/ui/navigation-menu/NavigationMenuLink.vue",
    },
    {
      path: "NavigationMenuList.vue",
      target: "components/ui/navigation-menu/NavigationMenuList.vue",
    },
    {
      path: "NavigationMenuTrigger.vue",
      target: "components/ui/navigation-menu/NavigationMenuTrigger.vue",
    },
    {
      path: "NavigationMenuViewport.vue",
      target: "components/ui/navigation-menu/NavigationMenuViewport.vue",
    },
    {
      path: "navigation-menu.variants.ts",
      target: "components/ui/navigation-menu/navigation-menu.variants.ts",
    },
    { path: "index.ts", target: "components/ui/navigation-menu/index.ts" },
  ],
  dependencies: [
    "@vueuse/core",
    "class-variance-authority",
    "lucide-vue-next",
    "reka-ui",
  ],
  registryDependencies: [],
});
