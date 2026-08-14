import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'cash-flow-treasury-dashboard',
  type: 'registry:block',
  categories: ['finance', 'dashboard', 'analytics'],
  description:
    'Fluxo and Mercury style corporate cash flow treasury dashboard with 30-day runway projection, liquidity buffer monitor, inflow/outflow breakdown, and connected bank accounts table.',
  framework: 'react',
  files: [{ path: 'CashFlowTreasuryDashboard.tsx', target: 'components/blocks/CashFlowTreasuryDashboard.tsx' }],
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
