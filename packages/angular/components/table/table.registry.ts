import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'table',
  type: 'registry:ui',
  categories: ['data-display'],
  framework: 'angular',
  description:
    'Plain HTML table primitives — Table, Header, Row, Cell — with the registry borders, padding, and tokens applied. Use this when Data Table is too heavy.',
  files: [
    { path: 'table.component.ts', target: 'components/ui/table/table.component.ts' },
    { path: 'index.ts', target: 'components/ui/table/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})
