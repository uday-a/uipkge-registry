import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'data-table',
  type: 'registry:ui',
  categories: ['data'],
  framework: 'angular',
  description:
    'Full-feature table with sorting, filtering, column visibility, pagination, and CSV export. Pass columns + data and configure as needed.',
  files: [
    { path: 'data-table.component.ts', target: 'components/ui/data-table/data-table.component.ts' },
    { path: 'index.ts', target: 'components/ui/data-table/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})
