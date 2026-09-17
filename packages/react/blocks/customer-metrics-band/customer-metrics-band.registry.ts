import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'customer-metrics-band',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Customer velocity and ROI telemetry band with cohort segmentation (Enterprise vs High-Growth), 4 verified KPI metric tiles, and deep-dive impact inspector.',
  files: [{ path: 'CustomerMetricsBand.tsx', target: 'components/blocks/CustomerMetricsBand.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: ['https://uipkge.dev/r/badge.json', 'https://uipkge.dev/r/card.json'],
})
