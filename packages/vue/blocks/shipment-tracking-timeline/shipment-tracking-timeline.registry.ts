import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'shipment-tracking-timeline',
  type: 'registry:block',
  categories: ['logistics', 'dashboard', 'app'],
  description:
    'Flexport & Maersk style container freight tracking timeline with live AIS vessel telemetry, voyage ETA milestones, Reefer cold-chain specifications, and multimodal transport logistics.',
  framework: 'vue',
  files: [{ path: 'ShipmentTrackingTimeline.vue', target: 'components/blocks/ShipmentTrackingTimeline.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/separator.json',
  ],
})
