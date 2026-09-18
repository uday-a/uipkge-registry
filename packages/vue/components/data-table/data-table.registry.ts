import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'data-table',
  type: 'registry:ui',
  categories: ['data'],
  framework: 'vue',
  description:
    'Full-feature table with sorting, filtering, column pinning, pagination, row selection, and an opinionated header/toolbar. Built on TanStack Table — pass `columns` + `data` and configure as needed.',
  files: [
    { path: 'DataTable.vue', target: 'components/ui/data-table/DataTable.vue' },
    { path: 'DataTableColumnHeader.vue', target: 'components/ui/data-table/DataTableColumnHeader.vue' },
    { path: 'DataTableFilterPopover.vue', target: 'components/ui/data-table/DataTableFilterPopover.vue' },
    { path: 'DataTableFilterSheet.vue', target: 'components/ui/data-table/DataTableFilterSheet.vue' },
    { path: 'DataTablePagination.vue', target: 'components/ui/data-table/DataTablePagination.vue' },
    { path: 'DataTableToolbar.vue', target: 'components/ui/data-table/DataTableToolbar.vue' },
    { path: 'index.ts', target: 'components/ui/data-table/index.ts' },
  ],
  dependencies: ['@internationalized/date', '@tanstack/vue-table', 'lucide-vue-next', 'reka-ui'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/command.json',
    'https://uipkge.dev/r/dropdown-menu.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/label.json',
    'https://uipkge.dev/r/popover.json',
    'https://uipkge.dev/r/range-calendar.json',
    'https://uipkge.dev/r/select.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/sheet.json',
    'https://uipkge.dev/r/table.json',
  ],
})
