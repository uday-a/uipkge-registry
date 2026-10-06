import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'hexbin-map',
  type: 'registry:ui',
  framework: 'angular',
  categories: ['chart'],
  description:
    'Interactive Mapbox hex cartogram. US-states and world-regions presets with value-shaded hex markers, click-to-select detail cards, a projection switcher, and a color-ramp legend. Theme-aware via registry tokens.',
  files: [
    { path: 'hexbin-map.component.ts', target: 'components/ui/charts/hexbin-map/hexbin-map.component.ts' },
    { path: 'index.ts', target: 'components/ui/charts/hexbin-map/index.ts' },
  ],
  dependencies: [],
  registryDependencies: ['https://uipkge.dev/r/map.json'],
})
