import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'isochrone-reachability-map',
  type: 'registry:block',
  categories: ['logistics', 'geo', 'map'],
  description:
    'Drive-time reachability zones showing 10m, 20m, and 30m commute polygons with workforce population metrics.',
  framework: 'react',
  files: [{ path: 'IsochroneReachabilityMap.tsx', target: 'components/blocks/IsochroneReachabilityMap.tsx' }],
  dependencies: [],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/map.json',
  ],
})
