import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'transaction-feed',
  type: 'registry:block',
  categories: ['finance', 'app', 'billing'],
  description:
    'Brex/Ramp-style real-time corporate transaction feed with expense categorization, summary financial stat cards, search and filter toolbar, cardholder metadata, receipt attachment triggers, and row action menus.',
  framework: 'vue',
  files: [{ path: 'TransactionFeed.vue', target: 'components/blocks/TransactionFeed.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/dropdown-menu.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/select.json',
    'https://uipkge.dev/r/table.json',
  ],
})
