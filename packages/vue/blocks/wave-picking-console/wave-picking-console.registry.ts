import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'wave-picking-console',
  type: 'registry:block',
  categories: ['dashboard', 'data-display'],
  framework: 'vue',
  description:
    'Batch wave picking console with multi-order tote assignment, optimized pick route, and barcode verification.',
  files: [
    { path: 'WavePickingConsole.vue', target: 'components/blocks/wave-picking-console/WavePickingConsole.vue' },
    { path: 'index.ts', target: 'components/blocks/wave-picking-console/index.ts' },
  ],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/table.json',
  ],
})
