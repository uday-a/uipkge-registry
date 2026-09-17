import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'stock-transfer-manager',
  type: 'registry:block',
  categories: ['dashboard', 'data-display'],
  framework: 'react',
  description:
    'Inter-facility inventory transfer console with bin-level routing, barcode lookup, and condition classification.',
  files: [
    { path: 'StockTransferManager.tsx', target: 'components/blocks/stock-transfer-manager/StockTransferManager.tsx' },
    { path: 'index.ts', target: 'components/blocks/stock-transfer-manager/index.ts' },
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
