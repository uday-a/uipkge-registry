import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'payouts-management-table',
  type: 'registry:block',
  categories: ['finance', 'app', 'billing'],
  description:
    'Merchant payout management page: automated payout schedule controls, instant payout trigger, summary balance cards for available, in-transit, and rolling reserve balances, verified settlement bank account destination card, and an itemized batch transfer history table with gross/fee/net amounts, status badges, and action menus.',
  framework: 'vue',
  files: [{ path: 'PayoutsManagementTable.vue', target: 'components/blocks/PayoutsManagementTable.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/dropdown-menu.json',
    'https://uipkge.dev/r/table.json',
  ],
})
