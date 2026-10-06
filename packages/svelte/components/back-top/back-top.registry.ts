import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'back-top',
  type: 'registry:ui',
  categories: ['navigation', 'utility'],
  framework: 'svelte',
  description:
    'Scroll-to-top floating button. Appears after the target container scrolls past a threshold and smooth-scrolls back on click. Supports custom target container, visibility threshold, scroll behavior, custom icon snippet, four edge anchors, size variants, and edge offset.',
  files: [
    { path: 'BackTop.svelte', target: 'components/ui/back-top/BackTop.svelte' },
    { path: 'back-top.variants.ts', target: 'components/ui/back-top/back-top.variants.ts' },
    { path: 'index.ts', target: 'components/ui/back-top/index.ts' },
  ],
  dependencies: ['@lucide/svelte', 'class-variance-authority'],
  registryDependencies: [],
})
