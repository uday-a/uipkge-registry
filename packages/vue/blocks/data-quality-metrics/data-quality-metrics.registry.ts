import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'data-quality-metrics',
  type: 'registry:block',
  categories: ['devops', 'dashboard', 'app', 'data'],
  description:
    'Great Expectations and Soda style automated data quality assertions, schema validation, and drift detector dashboard: top header with overall quality score and run triggers, 4 assertion metric cards, data quality assertions table with category filters, and an interactive anomaly inspector drawer with SQL quarantine remediation.',
  framework: 'vue',
  files: [{ path: 'DataQualityMetrics.vue', target: 'components/blocks/DataQualityMetrics.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/progress.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/sheet.json',
    'https://uipkge.dev/r/table.json',
  ],
})
