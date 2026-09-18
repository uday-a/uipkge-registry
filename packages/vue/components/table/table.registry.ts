import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'table',
  type: 'registry:ui',
  categories: ['data-display'],
  framework: 'vue',
  description:
    'Plain HTML table primitives — `<Table>`, `<TableHeader>`, `<TableRow>`, `<TableCell>` — with the registry’s borders, padding, and tokens already applied. Use this when Data Table is too heavy.',
  files: [
    { path: 'Table.vue', target: 'components/ui/table/Table.vue' },
    { path: 'TableBody.vue', target: 'components/ui/table/TableBody.vue' },
    { path: 'TableCaption.vue', target: 'components/ui/table/TableCaption.vue' },
    { path: 'TableCell.vue', target: 'components/ui/table/TableCell.vue' },
    { path: 'TableEmpty.vue', target: 'components/ui/table/TableEmpty.vue' },
    { path: 'TableFooter.vue', target: 'components/ui/table/TableFooter.vue' },
    { path: 'TableHead.vue', target: 'components/ui/table/TableHead.vue' },
    { path: 'TableHeader.vue', target: 'components/ui/table/TableHeader.vue' },
    { path: 'TableRow.vue', target: 'components/ui/table/TableRow.vue' },
    { path: 'index.ts', target: 'components/ui/table/index.ts' },
    { path: 'utils.ts', target: 'components/ui/table/utils.ts' },
  ],
  dependencies: ['@tanstack/vue-table', '@vueuse/core'],
  registryDependencies: [],
})
