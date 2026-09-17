import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'disaster-response-map',
  type: 'registry:block',
  categories: ['logistics', 'emergency', 'map'],
  description:
    'Incident management map with wildfire hazard perimeter, shelter capacities, and emergency staging points.',
  framework: 'vue',
  files: [{ path: 'DisasterResponseMap.vue', target: 'components/blocks/DisasterResponseMap.vue' }],
  dependencies: [],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/map.json',
  ],
})
