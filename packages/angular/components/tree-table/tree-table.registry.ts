import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'tree-table',
  type: 'registry:ui',
  categories: ['data', 'display'],
  framework: 'angular',
  description:
    'Hierarchical data table with expandable parent/child rows. Column config, per-level indent, row selection checkboxes, loading overlay, and empty state. Built on the table primitives.',
  files: [
    { path: 'tree-table.component.ts', target: 'components/ui/tree-table/tree-table.component.ts' },
    { path: 'index.ts', target: 'components/ui/tree-table/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})
