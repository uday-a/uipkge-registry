import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'tenant-rent-ledger',
  type: 'registry:block',
  categories: ['real-estate', 'app', 'billing', 'dashboard'],
  description:
    'Property management resident portal with tenant header, 4 financial overview cards (monthly rent, next due date, autopay status, escrow deposit), autopay toggle with date schedule selection, and a complete 6-record payment ledger with receipt actions.',
  framework: 'react',
  files: [{ path: 'TenantRentLedger.tsx', target: 'components/blocks/TenantRentLedger.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/switch.json',
    'https://uipkge.dev/r/table.json',
  ],
})
