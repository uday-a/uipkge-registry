import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'last-mile-courier-dispatch',
  type: 'registry:block',
  categories: ['dashboard', 'data-display'],
  framework: 'react',
  description:
    'Last-mile courier dispatch matrix with real-time route progress, ETA telemetry, and Proof of Delivery (POD) logging.',
  files: [
    {
      path: 'LastMileCourierDispatch.tsx',
      target: 'components/blocks/last-mile-courier-dispatch/LastMileCourierDispatch.tsx',
    },
    { path: 'index.ts', target: 'components/blocks/last-mile-courier-dispatch/index.ts' },
  ],
  dependencies: ['lucide-react', 'mapbox-gl', 'react-map-gl'],
  registryDependencies: [
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/table.json',
    'https://uipkge.dev/r/map.json',
  ],
})
