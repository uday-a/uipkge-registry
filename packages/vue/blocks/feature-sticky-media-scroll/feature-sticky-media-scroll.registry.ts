import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'feature-sticky-media-scroll',
  title: 'Features — Sticky Media Scroll',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Deep-dive where the visual pins while the copy scrolls beside it, the pinned pane swapping content as each section enters view, degrading to stacked pairs without observers.',
  framework: 'vue',
  files: [{ path: 'FeatureStickyMediaScroll.vue', target: 'components/blocks/FeatureStickyMediaScroll.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/separator.json',
  ],
})
