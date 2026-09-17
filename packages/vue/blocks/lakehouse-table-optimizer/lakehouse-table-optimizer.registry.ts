import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'lakehouse-table-optimizer',
  type: 'registry:block',
  categories: ['devops', 'app', 'analytics'],
  description:
    'Apache Iceberg and Delta Lake table maintenance manager, compaction optimizer, snapshot history visualizer, and time-travel SQL query helper.',
  framework: 'vue',
  files: [{ path: 'LakehouseTableOptimizer.vue', target: 'components/blocks/LakehouseTableOptimizer.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/progress.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/table.json',
    'https://uipkge.dev/r/tabs.json',
  ],
})
