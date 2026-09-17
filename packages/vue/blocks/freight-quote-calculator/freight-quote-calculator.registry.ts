import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'freight-quote-calculator',
  type: 'registry:block',
  categories: ['logistics', 'calculator'],
  description:
    'Multimodal Air, Ocean, and Ground freight rate estimator with CBM volumetric weight calculation, dynamic route pricing, value-added services, and live comparison quotes.',
  framework: 'vue',
  files: [{ path: 'FreightQuoteCalculator.vue', target: 'components/blocks/FreightQuoteCalculator.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/checkbox.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/select.json',
    'https://uipkge.dev/r/separator.json',
  ],
})
