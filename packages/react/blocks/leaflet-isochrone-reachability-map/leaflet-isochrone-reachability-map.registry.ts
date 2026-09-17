import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'leaflet-isochrone-reachability-map',
  type: 'registry:block',
  categories: ['logistics', 'geo', 'map'],
  description:
    'Drive-time reachability zones showing 10m, 20m, and 30m commute polygons with workforce population metrics — on free OpenStreetMap/Esri tiles, no API key.',
  framework: 'react',
  files: [
    {
      path: 'LeafletIsochroneReachabilityMap.tsx',
      target: 'components/blocks/LeafletIsochroneReachabilityMap.tsx',
    },
  ],
  dependencies: [],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/leaflet-map.json',
  ],
})
