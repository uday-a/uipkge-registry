import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'cascade-select',
  type: 'registry:ui',
  categories: ['control', 'form'],
  framework: 'angular',
  description:
    'Hierarchical cascading select where each level selection determines the next level options. Displays the selected path as labels. Supports search, clearable, disabled, and loading states.',
  files: [
    { path: 'cascade-select.component.ts', target: 'components/ui/cascade-select/cascade-select.component.ts' },
    { path: 'types.ts', target: 'components/ui/cascade-select/types.ts' },
    { path: 'index.ts', target: 'components/ui/cascade-select/index.ts' },
  ],
  dependencies: [],
  registryDependencies: ['https://uipkge.dev/r/popover.json'],
})
