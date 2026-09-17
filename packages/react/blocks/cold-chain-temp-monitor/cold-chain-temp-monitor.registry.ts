import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'cold-chain-temp-monitor',
  type: 'registry:block',
  categories: ['logistics', 'dashboard', 'app'],
  description:
    'Refrigerated pharmaceutical & perishable cargo IoT temperature logger and excursion monitoring with multi-reading time-series trend chart, upper/lower threshold guidelines, probe logging history table, and critical excursion alert protocol.',
  files: [{ path: 'ColdChainTempMonitor.tsx', target: 'components/blocks/ColdChainTempMonitor.tsx' }],
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
