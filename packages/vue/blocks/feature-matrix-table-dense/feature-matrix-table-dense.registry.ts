import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'feature-matrix-table-dense',
  type: 'registry:block',
  categories: ['feature', 'marketing'],
  framework: 'vue',
  description:
    'Dense Linear-style technical specification matrix table with collapsible sections and search filtering.',
  files: [
    {
      path: 'FeatureMatrixTableDense.vue',
      target: 'components/blocks/feature-matrix-table-dense/FeatureMatrixTableDense.vue',
    },
    { path: 'index.ts', target: 'components/blocks/feature-matrix-table-dense/index.ts' },
  ],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/utils.json',
  ],
})
