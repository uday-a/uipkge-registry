import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'comparison-vs-alternatives',
  title: 'Comparison — Versus Alternatives',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Two-column comparison setting this product against the status quo row by row, each line naming the mechanism rather than scoring the competitor.',
  framework: 'vue',
  files: [{ path: 'ComparisonVsAlternatives.vue', target: 'components/blocks/ComparisonVsAlternatives.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/separator.json',
  ],
})
