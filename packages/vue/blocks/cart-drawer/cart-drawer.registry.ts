import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'cart-drawer',
  type: 'registry:block',
  categories: ['commerce', 'ecommerce'],
  description:
    'Shopping cart drawer & full cart page view featuring free shipping progress meter, interactive line items with quantity steppers and variant tags, promo code application, order summary with tax & shipping calculation, trust badges, and empty state.',
  framework: 'vue',
  files: [{ path: 'CartDrawer.vue', target: 'components/blocks/CartDrawer.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/progress.json',
    'https://uipkge.dev/r/separator.json',
  ],
})
