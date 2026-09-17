import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'neighborhood-walkscore-card',
  type: 'registry:block',
  categories: ['real-estate', 'app', 'dashboard', 'marketing'],
  description:
    'Real estate neighborhood intelligence widget with Walk Score, Transit Score, Bike Score, categorized points of interest (transit, dining, schools, parks), and commute time estimator.',
  framework: 'vue',
  files: [{ path: 'NeighborhoodWalkscoreCard.vue', target: 'components/blocks/NeighborhoodWalkscoreCard.vue' }],
  dependencies: ['lucide-vue-next', 'mapbox-gl', '@studiometa/vue-mapbox-gl'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/progress.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/map.json',
  ],
})
