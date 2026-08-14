import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'backorder-split-shipment-manager',
  type: 'registry:block',
  categories: ['dashboard', 'data-display'],
  framework: 'react',
  description:
    'Order fulfillment split shipment manager with stock triage, backorder tracking, and multi-node dispatch controls.',
  files: [
    {
      path: 'BackorderSplitShipmentManager.tsx',
      target: 'components/blocks/backorder-split-shipment-manager/BackorderSplitShipmentManager.tsx',
    },
    { path: 'index.ts', target: 'components/blocks/backorder-split-shipment-manager/index.ts' },
  ],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/table.json',
  ],
})
