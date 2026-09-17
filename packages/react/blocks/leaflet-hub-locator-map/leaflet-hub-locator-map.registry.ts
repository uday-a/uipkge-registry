import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'leaflet-hub-locator-map',
  type: 'registry:block',
  categories: ['dashboard', 'app', 'logistics'],
  description:
    'Distribution hub locator on free OpenStreetMap tiles — no API key. Coverage rings, capacity badges, and fly-to on select.',
  framework: 'react',
  files: [{ path: 'LeafletHubLocatorMap.tsx', target: 'components/blocks/LeafletHubLocatorMap.tsx' }],
  dependencies: [],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/leaflet-map.json',
  ],
})
