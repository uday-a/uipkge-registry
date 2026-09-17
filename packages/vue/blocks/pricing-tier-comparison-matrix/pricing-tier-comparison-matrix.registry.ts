import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'pricing-tier-comparison-matrix',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Comprehensive pricing tier comparison matrix with billing cycle discount toggles, prominent recommended plan, and granular capability matrix table.',
  framework: 'vue',
  files: [{ path: 'PricingTierComparisonMatrix.vue', target: 'components/blocks/PricingTierComparisonMatrix.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
  ],
})
