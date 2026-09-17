import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'pricing-single-plan',
  title: 'Pricing — Single Plan',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'One-plan pricing section stating the price, what is included, what is explicitly not, and the usage line at which a conversation becomes worthwhile.',
  framework: 'vue',
  files: [{ path: 'PricingSinglePlan.vue', target: 'components/blocks/PricingSinglePlan.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/separator.json',
  ],
})
