import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'choropleth-map-chart',
  type: 'registry:ui',
  framework: 'angular',
  categories: ['chart'],
  description:
    'Choropleth map on the Mapbox primitive with bring-your-own GeoJSON. Value-shaded fill layer with a continuous legend, dashed corridor links, pin markers, and a projection switcher. Theme-aware via registry tokens.',
  files: [
    {
      path: 'choropleth-map-chart.component.ts',
      target: 'components/ui/charts/choropleth-map-chart/choropleth-map-chart.component.ts',
    },
    { path: 'index.ts', target: 'components/ui/charts/choropleth-map-chart/index.ts' },
  ],
  dependencies: [],
  registryDependencies: ['https://uipkge.dev/r/map.json'],
})
