import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'table',
  type: 'registry:ui',
  categories: ['data-display'],
  description:
    'Plain HTML table primitives — `<Table>`, `<TableHeader>`, `<TableRow>`, `<TableCell>` — with the registry’s borders, padding, and tokens already applied. Use this when Data Table is too heavy.',
  files: [
    { path: 'table.tsx', target: 'components/ui/table/table.tsx' },
    { path: 'utils.ts', target: 'components/ui/table/utils.ts' },
    { path: 'index.ts', target: 'components/ui/table/index.ts' },
  ],
  dependencies: ['@tanstack/react-table'],
  registryDependencies: [],
})
