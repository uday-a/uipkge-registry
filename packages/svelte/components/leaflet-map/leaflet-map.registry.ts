import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'leaflet-map',
  type: 'registry:ui',
  categories: ['data-display'],
  title: 'Leaflet Map',
  framework: 'svelte',
  description:
    'A thin, theme-aware Leaflet wrapper rendering free raster tiles (OpenStreetMap, OpenTopoMap, Esri) — no API key required. Drop LeafletMarker / LeafletPopup / LeafletPolyline / LeafletGeoJson into the children to build any map — fleet boards, journey maps, store locators. The base style follows light/dark automatically, an opt-in `muted` prop desaturates the tile pane so overlaid data is the only colour, and `oncreated` hands you the raw L.Map instance for custom layers and fitBounds.',
  files: [
    { path: 'LeafletMap.svelte', target: 'components/ui/leaflet-map/LeafletMap.svelte' },
    { path: 'LeafletMarker.svelte', target: 'components/ui/leaflet-map/LeafletMarker.svelte' },
    { path: 'LeafletPopup.svelte', target: 'components/ui/leaflet-map/LeafletPopup.svelte' },
    { path: 'LeafletTooltip.svelte', target: 'components/ui/leaflet-map/LeafletTooltip.svelte' },
    { path: 'LeafletPolyline.svelte', target: 'components/ui/leaflet-map/LeafletPolyline.svelte' },
    { path: 'LeafletPolygon.svelte', target: 'components/ui/leaflet-map/LeafletPolygon.svelte' },
    { path: 'LeafletCircle.svelte', target: 'components/ui/leaflet-map/LeafletCircle.svelte' },
    { path: 'LeafletCircleMarker.svelte', target: 'components/ui/leaflet-map/LeafletCircleMarker.svelte' },
    { path: 'LeafletGeoJson.svelte', target: 'components/ui/leaflet-map/LeafletGeoJson.svelte' },
    { path: 'LeafletTileLayer.svelte', target: 'components/ui/leaflet-map/LeafletTileLayer.svelte' },
    { path: 'leaflet-context.svelte.ts', target: 'components/ui/leaflet-map/leaflet-context.svelte.ts' },
    { path: 'leaflet-map.variants.ts', target: 'components/ui/leaflet-map/leaflet-map.variants.ts' },
    { path: 'index.ts', target: 'components/ui/leaflet-map/index.ts' },
    { path: 'leaflet-map.css', target: 'components/ui/leaflet-map/leaflet-map.css' },
  ],
  dependencies: ['leaflet', 'class-variance-authority'],
  registryDependencies: [],
})
