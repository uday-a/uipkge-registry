import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'data-catalog-lineage',
  type: 'registry:block',
  categories: ['devops', 'app', 'analytics', 'data'],
  description:
    'Alation and Monte Carlo style enterprise data catalog lineage map and table documentation explorer with interactive upstream source DAGs, dbt transform models, downstream BI consumer traces, schema column definitions with types and constraints, automated data quality assertions, and SQL console query runner.',
  framework: 'vue',
  files: [{ path: 'DataCatalogLineage.vue', target: 'components/blocks/DataCatalogLineage.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/table.json',
    'https://uipkge.dev/r/tabs.json',
  ],
})
