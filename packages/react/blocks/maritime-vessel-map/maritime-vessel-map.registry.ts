import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'maritime-vessel-map',
  type: 'registry:block',
  categories: ['logistics', 'maritime', 'map'],
  description:
    'Automatic Identification System (AIS) vessel tracking with container ships, tankers, speed, and anchorage status.',
  framework: 'react',
  files: [{ path: 'MaritimeVesselMap.tsx', target: 'components/blocks/MaritimeVesselMap.tsx' }],
  dependencies: [],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/map.json',
  ],
})
