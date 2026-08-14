import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'decision-matrix-table',
  type: 'registry:block',
  categories: ['productivity', 'app', 'table'],
  description:
    'Product and architectural decision matrix with dynamic weighted scoring algorithms (Impact, Confidence, Effort, Risk), RICE framework toggle, interactive weight sliders, option creator, multi-dimensional SVG tradeoff radar, and ADR consensus breakdown.',
  framework: 'vue',
  files: [{ path: 'DecisionMatrixTable.vue', target: 'components/blocks/DecisionMatrixTable.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/slider.json',
    'https://uipkge.dev/r/table.json',
  ],
})
