import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'leaflet-map',
  type: 'registry:ui',
  categories: ['data-display'],
  title: 'Leaflet Map',
  framework: 'angular',
  description:
    "A thin, theme-aware Leaflet wrapper as Angular standalone components (UiLeafletMapComponent + marker / popup / polyline / polygon / circle / tile-layer children) rendering free raster tiles — no API key required. The base style follows light/dark automatically, an opt-in `muted` input desaturates the tile pane, and `created` hands you the raw L.Map instance. Leaflet's stylesheet and the token-skinned map chrome ship in `leaflet-map.styles.ts` and are injected into <head> once — no angular.json edits.",
  files: [
    { path: 'leaflet-map.component.ts', target: 'components/ui/leaflet-map/leaflet-map.component.ts' },
    { path: 'leaflet-context.ts', target: 'components/ui/leaflet-map/leaflet-context.ts' },
    { path: 'leaflet-map.styles.ts', target: 'components/ui/leaflet-map/leaflet-map.styles.ts' },
    { path: 'leaflet-map.variants.ts', target: 'components/ui/leaflet-map/leaflet-map.variants.ts' },
    { path: 'index.ts', target: 'components/ui/leaflet-map/index.ts' },
  ],
  dependencies: ['leaflet', 'class-variance-authority'],
  devDependencies: ['@types/leaflet'],
  registryDependencies: [],
})
