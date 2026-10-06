import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'map',
  type: 'registry:ui',
  categories: ['data-display'],
  title: 'Map',
  framework: 'angular',
  description:
    "A thin, theme-aware Mapbox GL JS wrapper as Angular standalone components (UiMapComponent + UiMapMarkerComponent + UiMapSourceComponent + UiMapLayerComponent). Pass an access token and drop ui-map-marker / ui-map-source / ui-map-layer into the content slot to build any map. The base style follows light/dark automatically, an opt-in `muted` input desaturates the basemap, and `created` hands you the raw map instance. The design-system map chrome (map.css) and Mapbox GL's stylesheet load automatically; add mapbox-gl/dist/mapbox-gl.css to angular.json styles to self-host the latter.",
  files: [
    { path: 'map.component.ts', target: 'components/ui/map/map.component.ts' },
    { path: 'map.variants.ts', target: 'components/ui/map/map.variants.ts' },
    { path: 'index.ts', target: 'components/ui/map/index.ts' },
    { path: 'map.css', target: 'components/ui/map/map.css' },
  ],
  dependencies: ['mapbox-gl', 'class-variance-authority'],
  registryDependencies: [],
})
