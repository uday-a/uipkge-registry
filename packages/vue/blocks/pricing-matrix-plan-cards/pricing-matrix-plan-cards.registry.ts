import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'pricing-matrix-plan-cards',
  title: 'Pricing — Per-Plan Comparison',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Plan-first comparison that renders each plan as its own card of included and excluded capabilities, the layout a wide matrix should degrade to on a phone.',
  framework: 'vue',
  files: [{ path: 'PricingMatrixPlanCards.vue', target: 'components/blocks/PricingMatrixPlanCards.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/separator.json',
  ],
})
