import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'wholesale-b2b-quick-order',
  type: 'registry:block',
  categories: ['commerce', 'ecommerce'],
  description:
    'B2B wholesale bulk order matrix with volume tier pricing, case pack multipliers, and CSV SKU paste input.',
  files: [{ path: 'WholesaleB2bQuickOrder.tsx', target: 'components/blocks/WholesaleB2bQuickOrder.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/table.json',
    'https://uipkge.dev/r/textarea.json',
  ],
})
