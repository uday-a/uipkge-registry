import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'hub-locator-map',
  type: 'registry:block',
  categories: ['dashboard', 'app', 'logistics'],
  description: 'Global hub locator. Pins on a Mapbox map with a short location list and fly-to on select.',
  framework: 'vue',
  files: [{ path: 'HubLocatorMap.vue', target: 'components/blocks/HubLocatorMap.vue' }],
  dependencies: [],
  registryDependencies: ['https://uipkge.dev/r/card.json', 'https://uipkge.dev/r/map.json'],
})
