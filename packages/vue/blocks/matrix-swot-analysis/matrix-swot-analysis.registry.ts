import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'matrix-swot-analysis',
  type: 'registry:block',
  categories: ['productivity', 'dashboard', 'app', 'data'],
  description:
    'Strategic planning 2x2 SWOT analysis matrix (Strengths, Weaknesses, Opportunities, Threats) with dynamic card management, quadrant counters, TOWS strategic initiatives, and PDF/share toolbar.',
  framework: 'vue',
  files: [{ path: 'MatrixSwotAnalysis.vue', target: 'components/blocks/MatrixSwotAnalysis.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/separator.json',
  ],
})
