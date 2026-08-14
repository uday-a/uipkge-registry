import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'pricing-matrix-sticky-header',
  title: 'Pricing — Sticky Header Matrix',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Long feature matrix whose plan header row pins to the top while the body scrolls, so the column a checkmark belongs to stays identifiable at any scroll depth.',
  files: [{ path: 'PricingMatrixStickyHeader.tsx', target: 'components/blocks/PricingMatrixStickyHeader.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/table.json',
  ],
})
