import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'airbnb-host-earnings',
  type: 'registry:block',
  categories: ['real-estate', 'dashboard', 'hospitality', 'analytics', 'finance', 'app'],
  description:
    'Short-term rental host revenue dashboard: gross earnings with month-over-month growth, occupancy rate progress, ADR & RevPAR metrics, automated direct deposit payout schedule card, dynamic pricing AI rate recommendations, and an itemized reservation payout breakdown table.',
  framework: 'vue',
  files: [{ path: 'AirbnbHostEarnings.vue', target: 'components/blocks/AirbnbHostEarnings.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/progress.json',
    'https://uipkge.dev/r/select.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/table.json',
  ],
})
