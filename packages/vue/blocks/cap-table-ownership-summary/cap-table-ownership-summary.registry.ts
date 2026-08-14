import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'cap-table-ownership-summary',
  type: 'registry:block',
  categories: ['finance', 'app', 'dashboard'],
  description:
    'Carta-style company equity capitalization table, share class breakdown, fully diluted ownership percentages, shareholder vesting progress, and interactive round dilution modeling simulator.',
  framework: 'vue',
  files: [{ path: 'CapTableOwnershipSummary.vue', target: 'components/blocks/CapTableOwnershipSummary.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/progress.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/table.json',
  ],
})
