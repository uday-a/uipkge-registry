import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'metrics-grid',
  type: 'registry:block',
  categories: ['analytics', 'dashboard'],
  description:
    'Six-tile KPI status grid. Each tile pairs a stat header (count / percentage) with a small pie or horizontal bar chart that breaks the metric down. Different tiles use different chart types so each KPI reads at a glance.',
  files: [{ path: 'MetricsGrid.tsx', target: 'components/blocks/MetricsGrid.tsx' }],
  dependencies: ['echarts', 'echarts-for-react'],
  registryDependencies: ['https://uipkge.dev/r/pie-chart.json', 'https://uipkge.dev/r/bar-chart.json'],
})
