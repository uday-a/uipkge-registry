import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'price-drop-alert-card',
  type: 'registry:block',
  categories: ['commerce', 'ecommerce'],
  description:
    'E-commerce wishlist price tracker with 90-day price history chart, dynamic target price threshold slider, multi-channel alert configurator, and active tracked items table.',
  framework: 'vue',
  files: [{ path: 'PriceDropAlertCard.vue', target: 'components/blocks/PriceDropAlertCard.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/radio-group.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/slider.json',
    'https://uipkge.dev/r/switch.json',
    'https://uipkge.dev/r/table.json',
  ],
})
