import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'billing-usage-center',
  type: 'registry:block',
  categories: ['finance', 'dashboard'],
  description:
    'Stacked billing center: a current-plan card with seat meter, monthly usage rows whose bars shift success → warning → destructive as they approach the limit (with overage notes), and an invoice history table with status pills, an unpaid-balance alert, and an empty state. Plan, usage, and invoices are all overridable.',
  framework: 'vue',
  files: [{ path: 'BillingUsageCenter.vue', target: 'components/blocks/BillingUsageCenter.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/alert.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/progress.json',
    'https://uipkge.dev/r/section-card.json',
    'https://uipkge.dev/r/table.json',
  ],
})
