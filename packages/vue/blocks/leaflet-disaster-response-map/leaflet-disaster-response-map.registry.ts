import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'leaflet-disaster-response-map',
  type: 'registry:block',
  categories: ['logistics', 'emergency', 'map'],
  description:
    'Incident management map on free OpenStreetMap/Esri tiles — no API key. Evacuation perimeter rings, shelter capacities, and emergency staging points.',
  framework: 'vue',
  files: [{ path: 'LeafletDisasterResponseMap.vue', target: 'components/blocks/LeafletDisasterResponseMap.vue' }],
  dependencies: [],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/leaflet-map.json',
  ],
})
