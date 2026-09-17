import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'calendar-heatmap',
  type: 'registry:ui',
  framework: 'vue',
  categories: ['chart'],
  description:
    'Year / quarter calendar heatmap wrapper around Apache ECharts. GitHub-style contribution grid with palette overrides. Theme-aware via registry tokens.',
  files: [
    { path: 'CalendarHeatmap.vue', target: 'components/ui/charts/calendar-heatmap/CalendarHeatmap.vue' },
    { path: 'index.ts', target: 'components/ui/charts/calendar-heatmap/index.ts' },
    { path: '../useChartTheme.ts', target: 'components/ui/charts/useChartTheme.ts' },
  ],
  dependencies: ['echarts', 'vue-echarts'],
  registryDependencies: [],
})
