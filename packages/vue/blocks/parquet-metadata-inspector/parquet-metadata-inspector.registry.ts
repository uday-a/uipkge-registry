import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'parquet-metadata-inspector',
  type: 'registry:block',
  categories: ['devops', 'app'],
  description:
    'Apache Parquet file format deep-dive inspector with telemetry overview, row groups switcher, column chunk statistics, dictionary encoding metrics, and hierarchical schema tree with repetition and definition levels.',
  framework: 'vue',
  files: [{ path: 'ParquetMetadataInspector.vue', target: 'components/blocks/ParquetMetadataInspector.vue' }],
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
