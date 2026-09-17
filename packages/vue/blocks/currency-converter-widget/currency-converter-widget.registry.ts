import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'currency-converter-widget',
  type: 'registry:block',
  categories: ['finance', 'fintech', 'billing', 'commerce'],
  description:
    'Wise and Revolut-style real-time multi-currency exchange calculator and transfer fee estimator with live mid-market rates, transparent fee breakdown rail, bank savings comparison, and quick-rate ticker.',
  framework: 'vue',
  files: [{ path: 'CurrencyConverterWidget.vue', target: 'components/blocks/CurrencyConverterWidget.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/select.json',
    'https://uipkge.dev/r/separator.json',
  ],
})
