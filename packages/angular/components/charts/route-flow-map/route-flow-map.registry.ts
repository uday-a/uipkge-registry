import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'route-flow-map',
  type: 'registry:ui',
  framework: 'angular',
  categories: ['chart'],
  description:
    'Global route and flight corridor flow map as pure dependency-free SVG. Renders great-circle Bezier curved arcs with traveling aircraft or data pulses via native SVG motion, origin and destination telemetry hubs, and hover inspection cards.',
  files: [
    { path: 'route-flow-map.component.ts', target: 'components/ui/charts/route-flow-map/route-flow-map.component.ts' },
    { path: 'index.ts', target: 'components/ui/charts/route-flow-map/index.ts' },
    { path: '../use-chart-theme.ts', target: 'components/ui/charts/use-chart-theme.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})
