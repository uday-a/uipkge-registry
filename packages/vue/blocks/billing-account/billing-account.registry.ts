import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'billing-account',
  type: 'registry:block',
  categories: ['finance', 'app', 'billing'],
  description:
    'Stripe-style account billing page: current-plan card with Pro badge, price and renewal date plus Upgrade / Cancel actions, usage meters for seats and projects, a payment-method row with update and delete actions, and a compact billing-history list with paid badges and per-invoice downloads. Data is hardcoded inline so you can wire it to your own billing API.',
  framework: 'vue',
  files: [{ path: 'BillingAccount.vue', target: 'components/blocks/BillingAccount.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/progress.json',
    'https://uipkge.dev/r/separator.json',
  ],
})
