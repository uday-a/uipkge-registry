import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'personal-finance-budget',
  type: 'registry:block',
  categories: ['finance', 'dashboard', 'app'],
  description:
    'YNAB and Copilot-style zero-based monthly budget planner: envelope category budgeting, monthly pacing metrics, real-time spending progress by envelope, color-coded health indicators, and savings goal trackers.',
  files: [{ path: 'PersonalFinanceBudget.tsx', target: 'components/blocks/PersonalFinanceBudget.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/progress.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/table.json',
  ],
})
