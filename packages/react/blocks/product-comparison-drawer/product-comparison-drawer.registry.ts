import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'product-comparison-drawer',
  type: 'registry:block',
  categories: ['commerce', 'ecommerce'],
  description:
    'Floating multi-product specification comparison bar with attribute diff highlighting, expanded full-matrix drawer comparison, and sticky buy triggers.',
  files: [{ path: 'ProductComparisonDrawer.tsx', target: 'components/blocks/ProductComparisonDrawer.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/switch.json',
    'https://uipkge.dev/r/table.json',
  ],
})
