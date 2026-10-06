import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'dotted-map-chart',
  type: 'registry:ui',
  framework: 'vue',
  categories: ['chart'],
  description:
    'Dotted world/USA map on Mapbox GL. Telemetry dot grid with theme-aware dot color, connection route arcs, and pulsing lat/lng pins with hover cards.',
  files: [
    { path: 'DottedMapChart.vue', target: 'components/ui/charts/dotted-map-chart/DottedMapChart.vue' },
    { path: 'index.ts', target: 'components/ui/charts/dotted-map-chart/index.ts' },
    { path: '../useChartTheme.ts', target: 'components/ui/charts/useChartTheme.ts' },
  ],
  dependencies: ['lucide-vue-next'],
  registryDependencies: ['https://uipkge.dev/r/map.json'],
})
