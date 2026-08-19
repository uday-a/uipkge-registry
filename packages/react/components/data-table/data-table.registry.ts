import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "data-table",
  type: "registry:ui",
  categories: ["data"],
  description:
    "Full-feature table with sorting, filtering, column pinning, pagination, row selection, and an opinionated header/toolbar. Built on TanStack Table — pass `columns` + `data` and configure as needed.",
  files: [
    { path: "DataTable.tsx", target: "components/ui/data-table/DataTable.tsx" },
    {
      path: "DataTableColumnHeader.tsx",
      target: "components/ui/data-table/DataTableColumnHeader.tsx",
    },
    {
      path: "DataTableFilterPopover.tsx",
      target: "components/ui/data-table/DataTableFilterPopover.tsx",
    },
    {
      path: "DataTableFilterSheet.tsx",
      target: "components/ui/data-table/DataTableFilterSheet.tsx",
    },
    {
      path: "DataTablePagination.tsx",
      target: "components/ui/data-table/DataTablePagination.tsx",
    },
    {
      path: "DataTableToolbar.tsx",
      target: "components/ui/data-table/DataTableToolbar.tsx",
    },
    { path: "types.ts", target: "components/ui/data-table/types.ts" },
    { path: "date-utils.ts", target: "components/ui/data-table/date-utils.ts" },
    { path: "index.ts", target: "components/ui/data-table/index.ts" },
  ],
  dependencies: ["@tanstack/react-table", "react-day-picker", "lucide-react"],
  registryDependencies: [
    "https://uipkge.dev/r/badge.json",
    "https://uipkge.dev/r/button.json",
    "https://uipkge.dev/r/card.json",
    "https://uipkge.dev/r/command.json",
    "https://uipkge.dev/r/dropdown-menu.json",
    "https://uipkge.dev/r/input.json",
    "https://uipkge.dev/r/label.json",
    "https://uipkge.dev/r/popover.json",
    "https://uipkge.dev/r/range-calendar.json",
    "https://uipkge.dev/r/select.json",
    "https://uipkge.dev/r/separator.json",
    "https://uipkge.dev/r/sheet.json",
    "https://uipkge.dev/r/table.json",
  ],
});
