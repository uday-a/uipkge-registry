import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'flash-sale-offer-bar',
  type: 'registry:block',
  categories: ['ecommerce', 'marketing'],
  framework: 'vue',
  description:
    'Limited-time flash sale countdown deal bar with stock claim progress meter, tiered multi-buy volume discounts, and 1-click cart activation.',
  files: [
    { path: 'FlashSaleOfferBar.vue', target: 'components/blocks/flash-sale-offer-bar/FlashSaleOfferBar.vue' },
    { path: 'index.ts', target: 'components/blocks/flash-sale-offer-bar/index.ts' },
  ],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/progress.json',
  ],
})
