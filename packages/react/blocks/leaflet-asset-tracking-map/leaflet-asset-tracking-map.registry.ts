import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'leaflet-asset-tracking-map',
  type: 'registry:block',
  categories: ['logistics', 'supply-chain', 'map'],
  description:
    'Intermodal cargo container tracking on free Esri satellite tiles — no API key — with shipping lanes, cold-chain sensor status, and geofence state.',
  framework: 'react',
  files: [{ path: 'LeafletAssetTrackingMap.tsx', target: 'components/blocks/LeafletAssetTrackingMap.tsx' }],
  dependencies: [],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/leaflet-map.json',
  ],
})
