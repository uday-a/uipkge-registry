import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'store-pickup-curbside',
  type: 'registry:block',
  categories: ['commerce', 'app', 'ecommerce', 'logistics'],
  description:
    'Buy Online Pick Up in Store (BOPIS) & curbside pickup coordination board with customer arrival parking check-in, real-time staging bin tracking, runner fulfillment dispatch, and SLA monitoring.',
  files: [{ path: 'StorePickupCurbside.tsx', target: 'components/blocks/StorePickupCurbside.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/dialog.json',
    'https://uipkge.dev/r/dropdown-menu.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/select.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/table.json',
  ],
})
