import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'commute-reimbursement-claims',
  type: 'registry:block',
  categories: ['hr', 'app', 'finance'],
  description:
    'Monthly commuter transit pass, mileage, and EV charging expense claim reimbursement portal with IRS pre-tax allowance metrics, claim submission form with receipt dropzone, and claims history ledger.',
  framework: 'vue',
  files: [{ path: 'CommuteReimbursementClaims.vue', target: 'components/blocks/CommuteReimbursementClaims.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/dialog.json',
    'https://uipkge.dev/r/dropdown-menu.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/progress.json',
    'https://uipkge.dev/r/select.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/table.json',
  ],
})
