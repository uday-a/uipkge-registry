import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'map',
  type: 'registry:ui',
  categories: ['data-display'],
  title: 'Map',
  framework: 'svelte',
  description:
    'A thin, theme-aware Mapbox GL JS wrapper. Pass an access token and drop MapMarker / MapPopup / MapSource / MapLayer into the children to build any map — fleet boards, journey maps, store locators. The base style follows light/dark automatically, an opt-in `muted` prop desaturates the basemap so overlaid data is the only colour, and `oncreated` hands you the raw map instance for custom layers and fitBounds.',
  files: [
    { path: 'Map.svelte', target: 'components/ui/map/Map.svelte' },
    { path: 'MapSource.svelte', target: 'components/ui/map/MapSource.svelte' },
    { path: 'MapLayer.svelte', target: 'components/ui/map/MapLayer.svelte' },
    { path: 'MapMarker.svelte', target: 'components/ui/map/MapMarker.svelte' },
    { path: 'MapPopup.svelte', target: 'components/ui/map/MapPopup.svelte' },
    { path: 'MapNavigationControl.svelte', target: 'components/ui/map/MapNavigationControl.svelte' },
    { path: 'MapFullscreenControl.svelte', target: 'components/ui/map/MapFullscreenControl.svelte' },
    { path: 'map-context.svelte.ts', target: 'components/ui/map/map-context.svelte.ts' },
    { path: 'map.variants.ts', target: 'components/ui/map/map.variants.ts' },
    { path: 'index.ts', target: 'components/ui/map/index.ts' },
    { path: 'map.css', target: 'components/ui/map/map.css' },
  ],
  dependencies: ['mapbox-gl', 'class-variance-authority'],
  registryDependencies: [],
})
