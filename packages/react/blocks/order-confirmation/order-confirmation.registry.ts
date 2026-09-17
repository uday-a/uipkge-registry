import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'order-confirmation',
  type: 'registry:block',
  categories: ['commerce', 'ecommerce'],
  description:
    'Post-purchase order confirmation & tracking page featuring a success banner with emerald checkmark halo, 4-step shipment progress bar with pulsing active state, itemized order breakdown, and customer delivery & payment cards.',
  files: [{ path: 'OrderConfirmation.tsx', target: 'components/blocks/OrderConfirmation.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/separator.json',
  ],
})
