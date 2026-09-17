import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'leaflet-delivery-tracking-map',
  type: 'registry:block',
  categories: ['logistics', 'delivery', 'map'],
  description:
    'Live order delivery route on free OpenStreetMap tiles — no API key. Courier position, dropoff destination, and ETA telemetry.',
  framework: 'vue',
  files: [{ path: 'LeafletDeliveryTrackingMap.vue', target: 'components/blocks/LeafletDeliveryTrackingMap.vue' }],
  dependencies: [],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/leaflet-map.json',
  ],
})
