import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'cascade-select',
  type: 'registry:ui',
  categories: ['control', 'form'],
  framework: 'vue',
  description:
    'Hierarchical cascading select where each level selection determines the next level options. Displays the selected path as labels. Supports search, clearable, disabled, and loading states.',
  files: [
    { path: 'CascadeSelect.vue', target: 'components/ui/cascade-select/CascadeSelect.vue' },
    { path: 'types.ts', target: 'components/ui/cascade-select/types.ts' },
    { path: 'index.ts', target: 'components/ui/cascade-select/index.ts' },
  ],
  dependencies: ['lucide-vue-next', 'reka-ui'],
  registryDependencies: ['https://uipkge.dev/r/popover.json'],
})
