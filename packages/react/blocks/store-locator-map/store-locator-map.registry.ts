import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'store-locator-map',
  type: 'registry:block',
  categories: ['dashboard', 'app', 'ecommerce'],
  description: 'Store locator. Map pins plus a compact list with open/closed status and fly-to on select.',
  framework: 'react',
  files: [{ path: 'StoreLocatorMap.tsx', target: 'components/blocks/StoreLocatorMap.tsx' }],
  dependencies: [],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/map.json',
  ],
})
