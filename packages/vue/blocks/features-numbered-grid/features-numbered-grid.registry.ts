import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'features-numbered-grid',
  title: 'Features — Numbered Grid',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Six-cell feature grid drawn with one-pixel dividers instead of cards, each cell led by a monospace ordinal, an icon, a title, and two lines of supporting copy.',
  framework: 'vue',
  files: [{ path: 'FeaturesNumberedGrid.vue', target: 'components/blocks/FeaturesNumberedGrid.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: ['https://uipkge.dev/r/badge.json', 'https://uipkge.dev/r/button.json'],
})
