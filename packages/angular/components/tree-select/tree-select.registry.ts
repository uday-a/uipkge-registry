import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'tree-select',
  type: 'registry:ui',
  categories: ['control', 'form'],
  framework: 'angular',
  description:
    'Select from tree-structured data with expand/collapse nodes, single or multi-select with checkboxes, and search filtering. Dropdown shows a nested tree; parent selection cascades to leaf descendants.',
  files: [
    { path: 'tree-select.component.ts', target: 'components/ui/tree-select/tree-select.component.ts' },
    { path: 'tree-select-node.component.ts', target: 'components/ui/tree-select/tree-select-node.component.ts' },
    { path: 'tree-select.variants.ts', target: 'components/ui/tree-select/tree-select.variants.ts' },
    { path: 'types.ts', target: 'components/ui/tree-select/types.ts' },
    { path: 'index.ts', target: 'components/ui/tree-select/index.ts' },
  ],
  dependencies: ['class-variance-authority'],
  registryDependencies: ['https://uipkge.dev/r/popover.json'],
})
