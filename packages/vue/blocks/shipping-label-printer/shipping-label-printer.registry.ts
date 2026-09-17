import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'shipping-label-printer',
  type: 'registry:block',
  categories: ['logistics', 'app', 'ecommerce'],
  description:
    'Multi-carrier shipping label creator and dispatch station (USPS, FedEx, UPS, DHL) with live digital scale sync, package dimensional weight calculator, delivery options, and realistic 4x6 high-contrast thermal printable label preview.',
  framework: 'vue',
  files: [{ path: 'ShippingLabelPrinter.vue', target: 'components/blocks/ShippingLabelPrinter.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/radio-group.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/switch.json',
  ],
})
