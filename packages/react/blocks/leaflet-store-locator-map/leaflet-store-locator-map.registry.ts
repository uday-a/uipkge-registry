import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'leaflet-store-locator-map',
  type: 'registry:block',
  categories: ['dashboard', 'app', 'ecommerce'],
  description:
    'Store locator on free OpenStreetMap tiles — no API key. Pins with bound popups, distance/hours/amenities list, fly-to on select.',
  framework: 'react',
  files: [{ path: 'LeafletStoreLocatorMap.tsx', target: 'components/blocks/LeafletStoreLocatorMap.tsx' }],
  dependencies: [],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/leaflet-map.json',
  ],
})
