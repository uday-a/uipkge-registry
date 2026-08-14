import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'leaflet-property-boundary-map',
  type: 'registry:block',
  categories: ['real-estate', 'places', 'map'],
  description:
    'Cadastral parcel boundary polygons with zoning classes, lot acreage, and assessed valuation on free Esri satellite tiles — no API key.',
  framework: 'vue',
  files: [{ path: 'LeafletPropertyBoundaryMap.vue', target: 'components/blocks/LeafletPropertyBoundaryMap.vue' }],
  dependencies: [],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/leaflet-map.json',
  ],
})
