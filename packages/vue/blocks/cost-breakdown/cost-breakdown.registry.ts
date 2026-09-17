import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'cost-breakdown',
  type: 'registry:block',
  framework: 'vue',
  categories: ['finance', 'dashboard', 'analytics'],
  description:
    'Three-panel spend dashboard. Stacked weekly bar chart over time on top, plus two side-by-side categorical pies below (share by lane / share by carrier). Theme-aware via registry tokens.',
  files: [{ path: 'CostBreakdown.vue', target: 'components/blocks/CostBreakdown.vue' }],
  dependencies: ['echarts', 'vue-echarts'],
  registryDependencies: ['https://uipkge.dev/r/bar-chart.json', 'https://uipkge.dev/r/pie-chart.json'],
})
