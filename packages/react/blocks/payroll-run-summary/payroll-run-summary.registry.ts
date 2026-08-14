import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'payroll-run-summary',
  type: 'registry:block',
  categories: ['finance', 'app', 'billing'],
  description:
    'Gusto/Rippling style bi-weekly company payroll execution preview and tax reconciliation: cycle header with approval badge and submission controls, 4 primary payroll metric cards (company cost, net pay, employee withholdings, employer taxes), direct deposit ACH funding timeline, and itemized employee payroll table.',
  files: [{ path: 'PayrollRunSummary.tsx', target: 'components/blocks/PayrollRunSummary.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/table.json',
  ],
})
