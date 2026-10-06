import type { AngularStory } from './stories'

/** Story cards for the map Angular demo (titles mirror demos/react/map.tsx + the folded variant demos). */
export const stories: AngularStory[] = [
  {
    title: 'Default',
    description: 'Theme-aware basemap with a single marker. Pass an access token and drop a MapMarker into the slot.',
  },
  {
    title: 'Light',
    description: 'Clean editorial light palette for SaaS reporting, print-ready graphics, and billing portals.',
  },
  {
    title: 'Dark',
    description: 'Monochromatic dark palette designed for mission-critical dashboards and high-contrast overlays.',
  },
  {
    title: 'With Markers',
    description: 'Interactive marker pins across world hubs with labels.',
  },
  {
    title: 'Marker Popups',
    description: 'Interactive marker pins with customizable popup dialogs and reactive selection.',
  },
  {
    title: 'Muted Minimal',
    description:
      'Desaturated grayscale canvas where roads and terrain recede, giving custom telemetry markers visual priority.',
  },
  {
    title: 'Missing access token',
    description: 'Pass an empty access-token to skip the demo key. A placeholder renders until credentials arrive.',
  },
  {
    title: 'Controls off',
    description: 'Hide zoom, compass, and fullscreen when the map is decorative or you provide your own chrome.',
  },
  {
    title: 'Sizes',
    description: 'size="full" fills the parent — blocks typically pass size-full and let the layout own the height.',
  },
  {
    title: 'Declarative source and layer',
    description: 'Draw a GeoJSON line via the sources/layers inputs without touching the raw Mapbox instance.',
  },
]
