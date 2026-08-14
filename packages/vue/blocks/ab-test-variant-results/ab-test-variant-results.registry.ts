import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'ab-test-variant-results',
  type: 'registry:block',
  framework: 'vue',
  categories: ['analytics', 'marketing', 'dashboard'],
  description:
    'Optimizely and Statsig style A/B test statistical significance scorecard and conversion delta comparison. Features experiment status header, 4 primary experiment metrics cards, variants comparison table with statistical verdicts, and conversion funnel step drop-off comparison.',
  files: [{ path: 'AbTestVariantResults.vue', target: 'components/blocks/AbTestVariantResults.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/progress.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/table.json',
  ],
})
