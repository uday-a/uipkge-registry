import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'tax-summary-report',
  type: 'registry:block',
  categories: ['finance', 'app', 'billing', 'dashboard'],
  description:
    'QuickBooks and Stripe Tax style quarterly estimated tax calculator and liability report: four KPI summary cards, jurisdictional liability breakdown (federal, state, FICA), IRS Schedule C deductible expenses table with tax savings, and a quarterly filing timeline.',
  framework: 'vue',
  files: [{ path: 'TaxSummaryReport.vue', target: 'components/blocks/TaxSummaryReport.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/progress.json',
    'https://uipkge.dev/r/select.json',
    'https://uipkge.dev/r/table.json',
  ],
})
