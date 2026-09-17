import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'leaflet-threat-map-radar',
  type: 'registry:block',
  categories: ['security', 'dashboard', 'devops'],
  description:
    'Live threat radar on free OpenStreetMap/Esri dark tiles — no API key. Attack arcs hit edge PoPs under a rotating sweep; click an origin to isolate its vector.',
  framework: 'react',
  files: [{ path: 'LeafletThreatMapRadar.tsx', target: 'components/blocks/LeafletThreatMapRadar.tsx' }],
  dependencies: [],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/leaflet-map.json',
  ],
})
