import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'leaflet-hub-locator-map',
  type: 'registry:block',
  categories: ['dashboard', 'app', 'logistics'],
  description:
    'Distribution hub locator on free OpenStreetMap tiles — no API key. Coverage rings, capacity badges, and fly-to on select.',
  framework: 'vue',
  files: [{ path: 'LeafletHubLocatorMap.vue', target: 'components/blocks/LeafletHubLocatorMap.vue' }],
  dependencies: [],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/leaflet-map.json',
  ],
})
