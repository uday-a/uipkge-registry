import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'data-mesh-domain-catalog',
  type: 'registry:block',
  categories: ['devops', 'app', 'analytics', 'data'],
  description:
    'Zhamak Dehghani Data Mesh architecture domain catalog, Data Products directory, polyglot output ports (Snowflake, Kafka, GraphQL, S3), and federated computational governance SLA scorecards.',
  framework: 'vue',
  files: [{ path: 'DataMeshDomainCatalog.vue', target: 'components/blocks/DataMeshDomainCatalog.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/dropdown-menu.json',
    'https://uipkge.dev/r/progress.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/table.json',
  ],
})
