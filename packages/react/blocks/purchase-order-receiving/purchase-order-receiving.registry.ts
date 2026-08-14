import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'purchase-order-receiving',
  type: 'registry:block',
  categories: ['dashboard', 'data-display'],
  framework: 'react',
  description:
    'Inbound dock receiving workbench with PO matching, QA discrepancy logging, lot registration, and GRN generation.',
  files: [
    {
      path: 'PurchaseOrderReceiving.tsx',
      target: 'components/blocks/purchase-order-receiving/PurchaseOrderReceiving.tsx',
    },
    { path: 'index.ts', target: 'components/blocks/purchase-order-receiving/index.ts' },
  ],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/select.json',
    'https://uipkge.dev/r/table.json',
  ],
})
