import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'technical-specs-sheet',
  type: 'registry:block',
  categories: ['ecommerce', 'data-display'],
  framework: 'react',
  description:
    'Comprehensive engineering technical specifications sheet with Metric/Imperial SI toggles, parameter category filters, search, and downloadable PDF trigger.',
  files: [
    { path: 'TechnicalSpecsSheet.tsx', target: 'components/blocks/technical-specs-sheet/TechnicalSpecsSheet.tsx' },
    { path: 'index.ts', target: 'components/blocks/technical-specs-sheet/index.ts' },
  ],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/table.json',
  ],
})
