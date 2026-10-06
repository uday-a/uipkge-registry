import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'infinite-scroll',
  type: 'registry:ui',
  categories: ['utility', 'data'],
  framework: 'svelte',
  description:
    'Load-more-on-scroll sentinel. Fires an `onload` callback when the user scrolls near the bottom (or top, in reverse mode). Supports a window or element scroll target, distance threshold, loading/hasMore/disabled gating, and snippets for custom loading and end-of-list states.',
  files: [
    { path: 'InfiniteScroll.svelte', target: 'components/ui/infinite-scroll/InfiniteScroll.svelte' },
    { path: 'index.ts', target: 'components/ui/infinite-scroll/index.ts' },
  ],
  dependencies: ['@lucide/svelte'],
  registryDependencies: [],
})
