import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'choropleth-map-chart',
  type: 'registry:ui',
  framework: 'svelte',
  categories: ['chart'],
  description:
    'Choropleth map around the Mapbox-powered map primitive with bring-your-own GeoJSON. Value-shaded regions with a continuous scale legend, globe/mercator projection switcher, plus pin markers and dashed link lines. Theme-aware via registry tokens.',
  files: [
    {
      path: 'ChoroplethMapChart.svelte',
      target: 'components/ui/charts/choropleth-map-chart/ChoroplethMapChart.svelte',
    },
    { path: 'index.ts', target: 'components/ui/charts/choropleth-map-chart/index.ts' },
  ],
  dependencies: ['@lucide/svelte'],
  registryDependencies: ['https://uipkge.dev/r/map.json'],
})
