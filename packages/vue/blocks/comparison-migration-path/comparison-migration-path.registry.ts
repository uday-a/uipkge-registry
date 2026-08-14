import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'comparison-migration-path',
  title: 'Comparison — Migration Path',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Migration-focused comparison pairing what a team keeps, what changes, and what is retired when moving from an existing tool, with an effort estimate per row.',
  framework: 'vue',
  files: [{ path: 'ComparisonMigrationPath.vue', target: 'components/blocks/ComparisonMigrationPath.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/table.json',
  ],
})
