import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'pricing-tier-comparison-matrix',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Comprehensive pricing tier comparison matrix with billing cycle discount toggles, prominent recommended plan, and granular capability matrix table.',
  files: [{ path: 'PricingTierComparisonMatrix.tsx', target: 'components/blocks/PricingTierComparisonMatrix.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
  ],
})
