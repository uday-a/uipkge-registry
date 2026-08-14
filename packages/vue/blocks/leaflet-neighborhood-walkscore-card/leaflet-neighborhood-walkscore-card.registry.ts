import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'leaflet-neighborhood-walkscore-card',
  type: 'registry:block',
  categories: ['real-estate', 'app', 'dashboard', 'marketing'],
  description:
    'Real estate neighborhood intelligence widget on free OpenStreetMap/Esri tiles — no API key. Walk Score, Transit Score, Bike Score, categorized points of interest (transit, dining, schools, parks), a 15-minute walk radius, and commute time estimator.',
  framework: 'vue',
  files: [
    {
      path: 'LeafletNeighborhoodWalkscoreCard.vue',
      target: 'components/blocks/LeafletNeighborhoodWalkscoreCard.vue',
    },
  ],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/progress.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/leaflet-map.json',
  ],
})
