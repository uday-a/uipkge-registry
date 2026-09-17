import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'leaflet-fleet-vehicle-map',
  type: 'registry:block',
  categories: ['logistics', 'app', 'dashboard'],
  description:
    'Live fleet map on free OpenStreetMap/Esri tiles — no API key. Select a unit to fly the camera and read status.',
  framework: 'vue',
  files: [{ path: 'LeafletFleetVehicleMap.vue', target: 'components/blocks/LeafletFleetVehicleMap.vue' }],
  dependencies: [],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/leaflet-map.json',
  ],
})
