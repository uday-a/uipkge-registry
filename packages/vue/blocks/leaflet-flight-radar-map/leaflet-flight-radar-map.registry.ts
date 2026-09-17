import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'leaflet-flight-radar-map',
  type: 'registry:block',
  categories: ['logistics', 'aviation', 'map'],
  description:
    'Real-time commercial and cargo aviation radar on free OpenStreetMap/Esri tiles — no API key — with curved flight paths, callsigns, and flight telemetry.',
  framework: 'vue',
  files: [{ path: 'LeafletFlightRadarMap.vue', target: 'components/blocks/LeafletFlightRadarMap.vue' }],
  dependencies: [],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/leaflet-map.json',
  ],
})
