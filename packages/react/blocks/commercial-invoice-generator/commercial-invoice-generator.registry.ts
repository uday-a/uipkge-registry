import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'commercial-invoice-generator',
  type: 'registry:block',
  categories: ['dashboard', 'data-display'],
  framework: 'react',
  description:
    'B2B cross-border commercial invoice generator with HTS tariff codes, EORI tax identifiers, and CIF valuation totals.',
  files: [
    {
      path: 'CommercialInvoiceGenerator.tsx',
      target: 'components/blocks/commercial-invoice-generator/CommercialInvoiceGenerator.tsx',
    },
    { path: 'index.ts', target: 'components/blocks/commercial-invoice-generator/index.ts' },
  ],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/table.json',
  ],
})
