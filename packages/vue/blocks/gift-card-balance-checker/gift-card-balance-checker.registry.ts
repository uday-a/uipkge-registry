import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'gift-card-balance-checker',
  type: 'registry:block',
  categories: ['commerce', 'ecommerce', 'finance', 'app'],
  description:
    'Customer storefront gift card balance lookup, live digital card passbook, quick fund reloading, and complete redemption audit history ledger.',
  framework: 'vue',
  files: [{ path: 'GiftCardBalanceChecker.vue', target: 'components/blocks/GiftCardBalanceChecker.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/table.json',
    'https://uipkge.dev/r/tooltip.json',
  ],
})
