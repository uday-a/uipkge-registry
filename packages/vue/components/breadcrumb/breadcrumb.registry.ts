import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "breadcrumb",
  type: "registry:ui",
  categories: ["navigation"],
  framework: "vue",
  description:
    "Hierarchical wayfinding strip that shows a user’s position in a nested page tree. Built from `<BreadcrumbList>` and `<BreadcrumbItem>` primitives so you can drop in custom separators, dropdowns for collapsed parents, and ellipsis for overflow.",
  files: [
    {
      path: "Breadcrumb.vue",
      target: "components/ui/breadcrumb/Breadcrumb.vue",
    },
    {
      path: "BreadcrumbEllipsis.vue",
      target: "components/ui/breadcrumb/BreadcrumbEllipsis.vue",
    },
    {
      path: "BreadcrumbItem.vue",
      target: "components/ui/breadcrumb/BreadcrumbItem.vue",
    },
    {
      path: "BreadcrumbLink.vue",
      target: "components/ui/breadcrumb/BreadcrumbLink.vue",
    },
    {
      path: "BreadcrumbList.vue",
      target: "components/ui/breadcrumb/BreadcrumbList.vue",
    },
    {
      path: "BreadcrumbPage.vue",
      target: "components/ui/breadcrumb/BreadcrumbPage.vue",
    },
    {
      path: "BreadcrumbSeparator.vue",
      target: "components/ui/breadcrumb/BreadcrumbSeparator.vue",
    },
    { path: "index.ts", target: "components/ui/breadcrumb/index.ts" },
  ],
  dependencies: ["lucide-vue-next", "reka-ui"],
  registryDependencies: [],
});
