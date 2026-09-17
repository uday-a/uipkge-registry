import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'customer-metrics-band',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Customer velocity and ROI telemetry band with cohort segmentation (Enterprise vs High-Growth), 4 verified KPI metric tiles, and deep-dive impact inspector.',
  framework: 'vue',
  files: [{ path: 'CustomerMetricsBand.vue', target: 'components/blocks/CustomerMetricsBand.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: ['https://uipkge.dev/r/badge.json', 'https://uipkge.dev/r/card.json'],
})
