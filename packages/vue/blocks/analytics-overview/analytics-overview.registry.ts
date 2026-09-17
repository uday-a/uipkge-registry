import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'analytics-overview',
  type: 'registry:block',
  framework: 'vue',
  categories: ['analytics', 'dashboard'],
  description:
    'Two-pane analytics dashboard: stacked bar with dot overlay on a dual y-axis above, and an interactive drill-down line chart below. Click a bar to filter the bottom pane to that route.',
  files: [{ path: 'AnalyticsOverview.vue', target: 'components/blocks/AnalyticsOverview.vue' }],
  dependencies: ['echarts', 'vue-echarts'],
  registryDependencies: ['https://uipkge.dev/r/raw-chart.json'],
})
