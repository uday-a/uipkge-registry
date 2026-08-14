import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'cost-breakdown',
  type: 'registry:block',
  categories: ['finance', 'dashboard', 'analytics'],
  description:
    'Three-panel spend dashboard. Stacked weekly bar chart over time on top, plus two side-by-side categorical pies below (share by lane / share by carrier). Theme-aware via registry tokens.',
  files: [{ path: 'CostBreakdown.tsx', target: 'components/blocks/CostBreakdown.tsx' }],
  dependencies: ['echarts', 'echarts-for-react'],
  registryDependencies: ['https://uipkge.dev/r/bar-chart.json', 'https://uipkge.dev/r/pie-chart.json'],
})
