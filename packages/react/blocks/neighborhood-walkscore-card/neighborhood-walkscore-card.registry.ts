import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'neighborhood-walkscore-card',
  type: 'registry:block',
  categories: ['real-estate', 'app', 'dashboard', 'marketing'],
  description:
    'Real estate neighborhood intelligence widget with Walk Score, Transit Score, Bike Score, categorized points of interest (transit, dining, schools, parks), and commute time estimator.',
  framework: 'react',
  files: [{ path: 'NeighborhoodWalkscoreCard.tsx', target: 'components/blocks/NeighborhoodWalkscoreCard.tsx' }],
  dependencies: ['lucide-react', 'mapbox-gl', 'react-map-gl'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/progress.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/map.json',
  ],
})
