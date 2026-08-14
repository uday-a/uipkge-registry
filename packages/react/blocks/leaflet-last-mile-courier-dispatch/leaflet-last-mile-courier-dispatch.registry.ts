import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'leaflet-last-mile-courier-dispatch',
  type: 'registry:block',
  categories: ['dashboard', 'data-display'],
  description:
    'Last-mile courier dispatch matrix on free OpenStreetMap tiles — no API key. Route progress, ETA telemetry, and Proof of Delivery (POD) logging.',
  framework: 'react',
  files: [
    {
      path: 'LeafletLastMileCourierDispatch.tsx',
      target: 'components/blocks/LeafletLastMileCourierDispatch.tsx',
    },
  ],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/table.json',
    'https://uipkge.dev/r/leaflet-map.json',
  ],
})
