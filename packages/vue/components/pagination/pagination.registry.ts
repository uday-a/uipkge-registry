import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "pagination",
  type: "registry:ui",
  categories: ["navigation"],
  framework: "vue",
  description:
    "Page-number bar with previous/next, ellipsis collapse, and a configurable visible-window size. Pair with a data-table or any paged list.",
  files: [
    {
      path: "Pagination.vue",
      target: "components/ui/pagination/Pagination.vue",
    },
    {
      path: "PaginationEllipsis.vue",
      target: "components/ui/pagination/PaginationEllipsis.vue",
    },
    {
      path: "PaginationFirst.vue",
      target: "components/ui/pagination/PaginationFirst.vue",
    },
    {
      path: "PaginationLast.vue",
      target: "components/ui/pagination/PaginationLast.vue",
    },
    {
      path: "PaginationList.vue",
      target: "components/ui/pagination/PaginationList.vue",
    },
    {
      path: "PaginationListItem.vue",
      target: "components/ui/pagination/PaginationListItem.vue",
    },
    {
      path: "PaginationNext.vue",
      target: "components/ui/pagination/PaginationNext.vue",
    },
    {
      path: "PaginationPrev.vue",
      target: "components/ui/pagination/PaginationPrev.vue",
    },
    { path: "index.ts", target: "components/ui/pagination/index.ts" },
  ],
  dependencies: ["@vueuse/core", "lucide-vue-next", "reka-ui"],
  registryDependencies: [],
});
