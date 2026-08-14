import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'customer-reviews',
  type: 'registry:block',
  categories: ['commerce', 'ecommerce', 'marketing'],
  description:
    'Dedicated customer reviews section with ratings breakdown, interactive distribution bars, photo gallery with thumbnail overlay, filter chips, sort options, detailed verified buyer cards with attached photos, reactive helpful counter, and review submission form.',
  framework: 'vue',
  files: [{ path: 'CustomerReviews.vue', target: 'components/blocks/CustomerReviews.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/progress.json',
    'https://uipkge.dev/r/rating.json',
    'https://uipkge.dev/r/select.json',
  ],
})
