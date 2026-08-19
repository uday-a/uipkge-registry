import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "sidebar",
  type: "registry:ui",
  categories: ["navigation"],
  framework: "vue",
  description:
    "Full-height app sidebar — collapsible to icons, with grouping, sub-grouping, and integrated search. The navigation surface for product apps with many sections.",
  files: [
    { path: "Sidebar.vue", target: "components/ui/sidebar/Sidebar.vue" },
    {
      path: "SidebarContent.vue",
      target: "components/ui/sidebar/SidebarContent.vue",
    },
    {
      path: "SidebarFooter.vue",
      target: "components/ui/sidebar/SidebarFooter.vue",
    },
    {
      path: "SidebarGroup.vue",
      target: "components/ui/sidebar/SidebarGroup.vue",
    },
    {
      path: "SidebarGroupAction.vue",
      target: "components/ui/sidebar/SidebarGroupAction.vue",
    },
    {
      path: "SidebarGroupContent.vue",
      target: "components/ui/sidebar/SidebarGroupContent.vue",
    },
    {
      path: "SidebarGroupLabel.vue",
      target: "components/ui/sidebar/SidebarGroupLabel.vue",
    },
    {
      path: "SidebarHeader.vue",
      target: "components/ui/sidebar/SidebarHeader.vue",
    },
    {
      path: "SidebarInput.vue",
      target: "components/ui/sidebar/SidebarInput.vue",
    },
    {
      path: "SidebarInset.vue",
      target: "components/ui/sidebar/SidebarInset.vue",
    },
    {
      path: "SidebarMenu.vue",
      target: "components/ui/sidebar/SidebarMenu.vue",
    },
    {
      path: "SidebarMenuAction.vue",
      target: "components/ui/sidebar/SidebarMenuAction.vue",
    },
    {
      path: "SidebarMenuBadge.vue",
      target: "components/ui/sidebar/SidebarMenuBadge.vue",
    },
    {
      path: "SidebarMenuButton.vue",
      target: "components/ui/sidebar/SidebarMenuButton.vue",
    },
    {
      path: "SidebarMenuButtonChild.vue",
      target: "components/ui/sidebar/SidebarMenuButtonChild.vue",
    },
    {
      path: "SidebarMenuItem.vue",
      target: "components/ui/sidebar/SidebarMenuItem.vue",
    },
    {
      path: "SidebarMenuSkeleton.vue",
      target: "components/ui/sidebar/SidebarMenuSkeleton.vue",
    },
    {
      path: "SidebarMenuSub.vue",
      target: "components/ui/sidebar/SidebarMenuSub.vue",
    },
    {
      path: "SidebarMenuSubButton.vue",
      target: "components/ui/sidebar/SidebarMenuSubButton.vue",
    },
    {
      path: "SidebarMenuSubItem.vue",
      target: "components/ui/sidebar/SidebarMenuSubItem.vue",
    },
    {
      path: "SidebarProvider.vue",
      target: "components/ui/sidebar/SidebarProvider.vue",
    },
    {
      path: "SidebarRail.vue",
      target: "components/ui/sidebar/SidebarRail.vue",
    },
    {
      path: "SidebarSeparator.vue",
      target: "components/ui/sidebar/SidebarSeparator.vue",
    },
    {
      path: "SidebarTrigger.vue",
      target: "components/ui/sidebar/SidebarTrigger.vue",
    },
    {
      path: "sidebar.variants.ts",
      target: "components/ui/sidebar/sidebar.variants.ts",
    },
    { path: "index.ts", target: "components/ui/sidebar/index.ts" },
    { path: "utils.ts", target: "components/ui/sidebar/utils.ts" },
  ],
  dependencies: [
    "@vueuse/core",
    "class-variance-authority",
    "lucide-vue-next",
    "reka-ui",
  ],
  registryDependencies: [
    "https://uipkge.dev/r/button.json",
    "https://uipkge.dev/r/input.json",
    "https://uipkge.dev/r/separator.json",
    "https://uipkge.dev/r/sheet.json",
    "https://uipkge.dev/r/skeleton.json",
    "https://uipkge.dev/r/tooltip.json",
  ],
});
