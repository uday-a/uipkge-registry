import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'compliance-sanctions-screener',
  type: 'registry:block',
  categories: ['legal', 'dashboard', 'finance', 'security'],
  description:
    'AML/KYC OFAC, Politically Exposed Persons (PEP), and global sanctions list screening workbench with fuzzy match threshold tuning, real-time entity inspection modal, and prohibited match enforcement.',
  framework: 'react',
  files: [{ path: 'ComplianceSanctionsScreener.tsx', target: 'components/blocks/ComplianceSanctionsScreener.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/dialog.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/select.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/slider.json',
    'https://uipkge.dev/r/table.json',
  ],
})
