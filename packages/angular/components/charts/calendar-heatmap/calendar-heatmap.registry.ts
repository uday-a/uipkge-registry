import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'calendar-heatmap',
  type: 'registry:ui',
  framework: 'angular',
  categories: ['chart'],
  description:
    'Year / quarter calendar heatmap wrapper around Apache ECharts. GitHub-style contribution grid with palette overrides. Theme-aware via registry tokens.',
  files: [
    {
      path: 'calendar-heatmap.component.ts',
      target: 'components/ui/charts/calendar-heatmap/calendar-heatmap.component.ts',
    },
    { path: 'index.ts', target: 'components/ui/charts/calendar-heatmap/index.ts' },
    { path: '../use-chart-theme.ts', target: 'components/ui/charts/use-chart-theme.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})
