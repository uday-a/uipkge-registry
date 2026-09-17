import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'subpoena-legal-hold-manager',
  type: 'registry:block',
  categories: ['legal', 'app', 'compliance', 'security'],
  description:
    'Enterprise e-discovery litigation hold notice tracker, custodian preservation receipts, and compliance audit log.',
  files: [{ path: 'SubpoenaLegalHoldManager.tsx', target: 'components/blocks/SubpoenaLegalHoldManager.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/dropdown-menu.json',
    'https://uipkge.dev/r/progress.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/table.json',
  ],
})
