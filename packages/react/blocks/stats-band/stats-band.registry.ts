import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'stats-band',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Interactive live telemetry and performance matrix band with multi-timeframe switching, real-time SLA verification, regional cluster drilldown, and JSON export.',
  files: [{ path: 'StatsBand.tsx', target: 'components/blocks/StatsBand.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/separator.json',
  ],
})
