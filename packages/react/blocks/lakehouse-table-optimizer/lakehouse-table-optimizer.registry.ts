import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'lakehouse-table-optimizer',
  type: 'registry:block',
  categories: ['devops', 'app', 'analytics'],
  description:
    'Apache Iceberg and Delta Lake table maintenance manager, compaction optimizer, snapshot history visualizer, and time-travel SQL query helper.',
  files: [{ path: 'LakehouseTableOptimizer.tsx', target: 'components/blocks/LakehouseTableOptimizer.tsx' }],
  dependencies: ['lucide-react'],
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
