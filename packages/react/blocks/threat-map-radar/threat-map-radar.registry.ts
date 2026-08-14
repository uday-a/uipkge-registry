import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'threat-map-radar',
  type: 'registry:block',
  categories: ['security', 'dashboard', 'devops'],
  description:
    'Live threat radar over a Mapbox world map. Attack arcs hit edge PoPs; click an origin to isolate its vector.',
  framework: 'react',
  files: [{ path: 'ThreatMapRadar.tsx', target: 'components/blocks/ThreatMapRadar.tsx' }],
  dependencies: [],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/map.json',
  ],
})
