import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'virtual-list',
  type: 'registry:ui',
  categories: ['data-display'],
  framework: 'vue',
  description:
    'Generic windowed scroller. Renders only visible items plus a small overscan, with fixed or dynamic item sizes. Use for long lists where most rows are off-screen.',
  files: [
    { path: 'VirtualList.vue', target: 'components/ui/virtual-list/VirtualList.vue' },
    { path: 'index.ts', target: 'components/ui/virtual-list/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})
