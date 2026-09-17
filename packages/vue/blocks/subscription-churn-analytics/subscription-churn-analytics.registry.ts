import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'subscription-churn-analytics',
  type: 'registry:block',
  framework: 'vue',
  categories: ['analytics', 'fintech', 'dashboard'],
  description:
    'ChartMogul and Baremetrics style SaaS subscription churn and MRR analytics dashboard. Features 4 key SaaS metrics cards (Net MRR growth, logo churn rate, net revenue churn, and LTV/CAC), an MRR movement waterfall decomposition bridge, a churn reasons distribution table with lost ARR attribution and trend indicators, and automated churn prevention playbook quick actions.',
  files: [{ path: 'SubscriptionChurnAnalytics.vue', target: 'components/blocks/SubscriptionChurnAnalytics.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/progress.json',
    'https://uipkge.dev/r/select.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/table.json',
  ],
})
