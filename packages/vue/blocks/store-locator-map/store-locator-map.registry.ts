import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'store-locator-map',
  type: 'registry:block',
  categories: ['dashboard', 'app', 'ecommerce'],
  description: 'Store locator. Map pins plus a compact list with open/closed status and fly-to on select.',
  framework: 'vue',
  files: [{ path: 'StoreLocatorMap.vue', target: 'components/blocks/StoreLocatorMap.vue' }],
  dependencies: [],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/map.json',
  ],
})
