import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'dotted-map-chart',
  type: 'registry:ui',
  framework: 'angular',
  categories: ['chart'],
  description:
    'Dotted world/USA map on Mapbox GL. Telemetry dot grid with theme-aware dot color, connection route arcs, and pulsing lat/lng pins with hover cards.',
  files: [
    {
      path: 'dotted-map-chart.component.ts',
      target: 'components/ui/charts/dotted-map-chart/dotted-map-chart.component.ts',
    },
    { path: 'index.ts', target: 'components/ui/charts/dotted-map-chart/index.ts' },
    { path: '../use-chart-theme.ts', target: 'components/ui/charts/use-chart-theme.ts' },
  ],
  dependencies: ['mapbox-gl', 'lucide-angular'],
  registryDependencies: ['https://uipkge.dev/r/map.json'],
})
