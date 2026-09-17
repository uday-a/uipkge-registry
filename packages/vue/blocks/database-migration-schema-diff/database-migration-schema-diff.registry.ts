import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'database-migration-schema-diff',
  type: 'registry:block',
  categories: ['devops', 'app'],
  description:
    'Prisma, Flyway, and Liquibase database migration runner with pending DDL visual diffs, rollback scripts, schema integrity telemetry, and execution history.',
  framework: 'vue',
  files: [{ path: 'DatabaseMigrationSchemaDiff.vue', target: 'components/blocks/DatabaseMigrationSchemaDiff.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/table.json',
    'https://uipkge.dev/r/tabs.json',
  ],
})
