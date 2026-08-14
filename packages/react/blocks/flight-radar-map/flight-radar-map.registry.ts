import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'flight-radar-map',
  type: 'registry:block',
  categories: ['logistics', 'aviation', 'map'],
  description:
    'Real-time commercial and cargo aviation radar with aircraft altitudes, ground speeds, callsigns, and flight telemetry.',
  framework: 'react',
  files: [{ path: 'FlightRadarMap.tsx', target: 'components/blocks/FlightRadarMap.tsx' }],
  dependencies: [],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/map.json',
  ],
})
