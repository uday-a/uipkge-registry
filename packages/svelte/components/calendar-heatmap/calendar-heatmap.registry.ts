import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'calendar-heatmap',
  type: 'registry:ui',
  framework: 'svelte',
  categories: ['chart'],
  description:
    'Year / quarter calendar heatmap wrapper around Apache ECharts. GitHub-style contribution grid with palette overrides. Theme-aware via registry tokens.',
  files: [
    { path: 'CalendarHeatmap.svelte', target: 'components/ui/calendar-heatmap/CalendarHeatmap.svelte' },
    { path: 'chart-theme.ts', target: 'components/ui/calendar-heatmap/chart-theme.ts' },
    { path: 'index.ts', target: 'components/ui/calendar-heatmap/index.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})
