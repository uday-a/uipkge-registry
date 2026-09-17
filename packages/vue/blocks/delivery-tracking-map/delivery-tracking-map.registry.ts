import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'delivery-tracking-map',
  type: 'registry:block',
  categories: ['logistics', 'delivery', 'map'],
  description: 'Live order delivery route showing courier location, dropoff destination, and real-time ETA countdown.',
  framework: 'vue',
  files: [{ path: 'DeliveryTrackingMap.vue', target: 'components/blocks/DeliveryTrackingMap.vue' }],
  dependencies: [],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/map.json',
  ],
})
