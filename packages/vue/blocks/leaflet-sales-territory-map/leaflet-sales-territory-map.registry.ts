import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'leaflet-sales-territory-map',
  type: 'registry:block',
  categories: ['analytics', 'dashboard'],
  description:
    'Sales territory map on free OpenStreetMap/Esri tiles — no API key. Region boundary polygons and rep pins with quota attainment; select a territory to fly the camera.',
  framework: 'vue',
  files: [{ path: 'LeafletSalesTerritoryMap.vue', target: 'components/blocks/LeafletSalesTerritoryMap.vue' }],
  dependencies: [],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/leaflet-map.json',
  ],
})
