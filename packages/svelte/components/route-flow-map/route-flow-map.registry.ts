import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'route-flow-map',
  type: 'registry:ui',
  framework: 'svelte',
  categories: ['chart'],
  description:
    'Global route and flight corridor flow map as pure dependency-free SVG. Renders great-circle Bezier curved arcs with traveling aircraft or data pulses via native SVG motion, origin and destination telemetry hubs, and hover inspection cards.',
  files: [
    { path: 'RouteFlowMap.svelte', target: 'components/ui/route-flow-map/RouteFlowMap.svelte' },
    { path: 'index.ts', target: 'components/ui/route-flow-map/index.ts' },
    { path: 'chart-theme.ts', target: 'components/ui/route-flow-map/chart-theme.ts' },
  ],
  dependencies: [],
  registryDependencies: ['https://uipkge.dev/r/map.json'],
})
