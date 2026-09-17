import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'packing-slip-generator',
  type: 'registry:block',
  categories: ['logistics', 'app', 'ecommerce', 'documents'],
  description:
    'Shopify and ShipStation style warehouse order packing slip and picker verification checklist with warehouse header, customer ship-to routing, picker pack station barcode scan identifier, itemized pick list table with interactive packed checkboxes, bin location tags, SKU barcodes, weight calculations, and quality control inspector stamp.',
  files: [{ path: 'PackingSlipGenerator.tsx', target: 'components/blocks/PackingSlipGenerator.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/checkbox.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/table.json',
  ],
})
