import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'features-2x2-spotlight',
  title: 'Features — 2×2 Spotlight',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Four large feature panels in a two-by-two grid, each with a generous illustration slot built from primitives, a headline, supporting copy, and a quiet inline link.',
  framework: 'vue',
  files: [{ path: 'Features2x2Spotlight.vue', target: 'components/blocks/Features2x2Spotlight.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/progress.json',
    'https://uipkge.dev/r/separator.json',
  ],
})
