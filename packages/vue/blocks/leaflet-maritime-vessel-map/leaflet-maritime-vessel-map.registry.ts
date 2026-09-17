import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'leaflet-maritime-vessel-map',
  type: 'registry:block',
  categories: ['logistics', 'maritime', 'map'],
  description:
    'Automatic Identification System (AIS) vessel tracking on free OpenStreetMap/Esri tiles — no API key. Container ships, tankers, shipping lanes, and anchorage status.',
  framework: 'vue',
  files: [{ path: 'LeafletMaritimeVesselMap.vue', target: 'components/blocks/LeafletMaritimeVesselMap.vue' }],
  dependencies: [],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/leaflet-map.json',
  ],
})
