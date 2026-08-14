import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'contractor-timesheet-approval',
  type: 'registry:block',
  categories: ['finance', 'app', 'billing', 'productivity'],
  description:
    'Deel/Remote style international contractor invoice approval, hourly timesheet verification against GitHub PRs & deliverables, multi-currency payout calculation, overview KPI metrics, and itemized daily timesheet slide-over drawer.',
  framework: 'react',
  files: [
    {
      path: 'ContractorTimesheetApproval.tsx',
      target: 'components/blocks/ContractorTimesheetApproval.tsx',
    },
  ],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/dropdown-menu.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/sheet.json',
    'https://uipkge.dev/r/table.json',
  ],
})
