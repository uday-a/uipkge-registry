import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  { title: 'Default', description: 'Theme-aware Esri canvas with zoom and attribution chrome.' },
  { title: 'Variant switcher', description: 'Every key-free raster preset, switchable at runtime.' },
  {
    title: 'Markers & popups',
    description: 'Custom icon snippet plus bound popup and tooltip; default pin on the second marker.',
  },
  {
    title: 'Route & geofence',
    description: 'Polyline route, polygon zone, circle geofence, and a permanent label.',
  },
  { title: 'Muted canvas', description: 'Desaturated tiles so overlaid data is the only colour.' },
]
