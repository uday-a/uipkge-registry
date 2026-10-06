import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'infinite-scroll',
  type: 'registry:ui',
  categories: ['utility', 'data'],
  framework: 'angular',
  description:
    'Load-more-on-scroll sentinel. Emits a `load` event when the user scrolls near the bottom (or top, in reverse mode). Supports a window or element scroll target, distance threshold, loading/hasMore/disabled gating, and slots for custom loading and end-of-list states.',
  files: [
    { path: 'infinite-scroll.component.ts', target: 'components/ui/infinite-scroll/infinite-scroll.component.ts' },
    { path: 'index.ts', target: 'components/ui/infinite-scroll/index.ts' },
  ],
  dependencies: ['lucide-angular'],
  registryDependencies: [],
})
