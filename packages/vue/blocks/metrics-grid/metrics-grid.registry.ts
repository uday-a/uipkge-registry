import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'metrics-grid',
  type: 'registry:block',
  framework: 'vue',
  categories: ['analytics', 'dashboard'],
  description:
    'Six-tile KPI status grid. Each tile pairs a stat header (count / percentage) with a small pie or horizontal bar chart that breaks the metric down. Different tiles use different chart types so each KPI reads at a glance.',
  files: [{ path: 'MetricsGrid.vue', target: 'components/blocks/MetricsGrid.vue' }],
  dependencies: ['echarts', 'vue-echarts'],
  registryDependencies: ['https://uipkge.dev/r/pie-chart.json', 'https://uipkge.dev/r/bar-chart.json'],
})
