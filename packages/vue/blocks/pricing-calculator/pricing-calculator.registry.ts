import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'pricing-calculator',
  type: 'registry:block',
  categories: ['marketing', 'billing'],
  description:
    'Interactive SaaS and API pricing calculator with dynamic seat, request throughput, and cloud storage sliders, annual billing toggle with 20% discount, enterprise add-on switches, automated tier recommendation, and sticky live estimated cost breakdown.',
  framework: 'vue',
  files: [{ path: 'PricingCalculator.vue', target: 'components/blocks/PricingCalculator.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/slider.json',
    'https://uipkge.dev/r/switch.json',
  ],
})
