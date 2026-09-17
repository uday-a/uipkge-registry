import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'back-top',
  type: 'registry:ui',
  categories: ['navigation', 'utility'],
  framework: 'vue',
  description:
    'Scroll-to-top floating button. Appears after the target container scrolls past a threshold and smooth-scrolls back on click. Supports custom target container, visibility threshold, scroll behavior, custom icon slot, four edge anchors, size variants, and edge offset.',
  files: [
    { path: 'BackTop.vue', target: 'components/ui/back-top/BackTop.vue' },
    { path: 'back-top.variants.ts', target: 'components/ui/back-top/back-top.variants.ts' },
    { path: 'index.ts', target: 'components/ui/back-top/index.ts' },
  ],
  dependencies: ['class-variance-authority', 'lucide-vue-next'],
  registryDependencies: [],
})
