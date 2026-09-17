import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'feature-matrix-table-dense',
  type: 'registry:block',
  categories: ['feature', 'marketing'],
  framework: 'react',
  description:
    'Dense Linear-style technical specification matrix table with collapsible sections and search filtering.',
  files: [
    {
      path: 'FeatureMatrixTableDense.tsx',
      target: 'components/blocks/feature-matrix-table-dense/FeatureMatrixTableDense.tsx',
    },
    { path: 'index.ts', target: 'components/blocks/feature-matrix-table-dense/index.ts' },
  ],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/utils.json',
  ],
})
