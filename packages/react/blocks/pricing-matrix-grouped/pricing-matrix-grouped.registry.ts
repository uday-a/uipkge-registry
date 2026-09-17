import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'pricing-matrix-grouped',
  title: 'Pricing — Grouped Matrix',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Feature comparison matrix with collapsible capability groups, so a long plan comparison opens on the summary rows and expands only where the reader is looking.',
  files: [{ path: 'PricingMatrixGrouped.tsx', target: 'components/blocks/PricingMatrixGrouped.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/table.json',
  ],
})
