import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'frequently-bought-together',
  type: 'registry:block',
  categories: ['commerce', 'ecommerce'],
  description:
    'E-commerce frequently bought together bundle builder with interactive product preview cards, checkbox selection, dynamic bundle discount calculation, and one-click cart checkout.',
  framework: 'vue',
  files: [{ path: 'FrequentlyBoughtTogether.vue', target: 'components/blocks/FrequentlyBoughtTogether.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/checkbox.json',
  ],
})
