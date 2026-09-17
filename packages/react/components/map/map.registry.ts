import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'map',
  type: 'registry:ui',
  categories: ['data-display'],
  title: 'Map',
  description:
    'A thin, theme-aware Mapbox GL JS wrapper (built on react-map-gl). Pass an access token and drop MapMarker / MapPopup / MapLayer into the children to build any map — fleet boards, journey maps, store locators. The base style follows light/dark automatically, an opt-in `muted` prop desaturates the basemap so overlaid data is the only colour, and `onCreated` hands you the raw map instance for custom layers and fitBounds. Import `mapbox-gl/dist/mapbox-gl.css` once in your app.',
  files: [
    { path: 'map.tsx', target: 'components/ui/map/map.tsx' },
    { path: 'map.variants.ts', target: 'components/ui/map/map.variants.ts' },
    { path: 'index.ts', target: 'components/ui/map/index.ts' },
    { path: 'map.css', target: 'components/ui/map/map.css' },
  ],
  dependencies: ['react-map-gl', 'mapbox-gl', 'next-themes', 'class-variance-authority'],
  registryDependencies: [],
})
