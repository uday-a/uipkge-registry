import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'vector-map',
  type: 'registry:ui',
  framework: 'angular',
  categories: ['chart'],
  description:
    'Interactive Mapbox globe/mercator vector map. Region selector chips, pulsing pins, dashed flow routes, and telemetry cards for the active region and hovered pin. Theme-aware via registry tokens.',
  files: [
    { path: 'vector-map.component.ts', target: 'components/ui/charts/vector-map/vector-map.component.ts' },
    { path: 'index.ts', target: 'components/ui/charts/vector-map/index.ts' },
  ],
  dependencies: [],
  registryDependencies: ['https://uipkge.dev/r/map.json'],
})
