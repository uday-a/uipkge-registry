import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'loyalty-rewards-tier-hub',
  type: 'registry:block',
  categories: ['commerce', 'ecommerce', 'dashboard', 'marketing'],
  description:
    'Sephora and Starbucks style VIP customer loyalty tier dashboard, points wallet, and rewards catalog. Features a customer hero card with points balance, reward valuation, and tier progress tracker, 4 VIP privilege perks with unlock statuses, a 3-item redeemable rewards catalog grid, and a recent points earnings & redemption history ledger.',
  framework: 'vue',
  files: [{ path: 'LoyaltyRewardsTierHub.vue', target: 'components/blocks/LoyaltyRewardsTierHub.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/progress.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/table.json',
  ],
})
