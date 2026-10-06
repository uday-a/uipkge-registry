import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'table',
  type: 'registry:ui',
  categories: ['data-display'],
  framework: 'svelte',
  description:
    'Plain HTML table primitives — `<Table>`, `<TableHeader>`, `<TableRow>`, `<TableCell>` — with the registry’s borders, padding, and tokens already applied. Use this when Data Table is too heavy.',
  files: [
    { path: 'Table.svelte', target: 'components/ui/table/Table.svelte' },
    { path: 'TableBody.svelte', target: 'components/ui/table/TableBody.svelte' },
    { path: 'TableCaption.svelte', target: 'components/ui/table/TableCaption.svelte' },
    { path: 'TableCell.svelte', target: 'components/ui/table/TableCell.svelte' },
    { path: 'TableEmpty.svelte', target: 'components/ui/table/TableEmpty.svelte' },
    { path: 'TableFooter.svelte', target: 'components/ui/table/TableFooter.svelte' },
    { path: 'TableHead.svelte', target: 'components/ui/table/TableHead.svelte' },
    { path: 'TableHeader.svelte', target: 'components/ui/table/TableHeader.svelte' },
    { path: 'TableRow.svelte', target: 'components/ui/table/TableRow.svelte' },
    { path: 'index.ts', target: 'components/ui/table/index.ts' },
    { path: 'utils.ts', target: 'components/ui/table/utils.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})
