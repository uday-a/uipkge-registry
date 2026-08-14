import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'asset-tracking-map',
  type: 'registry:block',
  categories: ['logistics', 'supply-chain', 'map'],
  description:
    'Intermodal cargo container tracking with cold-chain sensor status, geofence perimeter rings, and battery levels.',
  framework: 'vue',
  files: [{ path: 'AssetTrackingMap.vue', target: 'components/blocks/AssetTrackingMap.vue' }],
  dependencies: [],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/map.json',
  ],
})
