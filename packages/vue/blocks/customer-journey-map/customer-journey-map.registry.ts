import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'customer-journey-map',
  type: 'registry:block',
  framework: 'vue',
  categories: ['analytics', 'dashboard', 'marketing'],
  description:
    'Visual customer lifecycle funnel and journey map tracking user touchpoints across Acquisition, Activation, Monetization, and Retention. Features conversion rates, friction analysis, sentiment gauges, growth experiment notes, and cross-stage velocity summaries.',
  files: [{ path: 'CustomerJourneyMap.vue', target: 'components/blocks/CustomerJourneyMap.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/progress.json',
    'https://uipkge.dev/r/separator.json',
  ],
})
