import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'cascade-select',
  type: 'registry:ui',
  categories: ['control', 'form'],
  framework: 'svelte',
  description:
    'Hierarchical cascading select where each level selection determines the next level options. Displays the selected path as labels. Supports search, clearable, disabled, and loading states.',
  files: [
    { path: 'CascadeSelect.svelte', target: 'components/ui/cascade-select/CascadeSelect.svelte' },
    { path: 'types.ts', target: 'components/ui/cascade-select/types.ts' },
    { path: 'index.ts', target: 'components/ui/cascade-select/index.ts' },
  ],
  dependencies: ['@lucide/svelte'],
  registryDependencies: ['https://uipkge.dev/r/popover.json'],
})
