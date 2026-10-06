import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  { title: 'Default', description: 'Theme-aware basemap with a single default pin marker.' },
  { title: 'Missing access token', description: 'Empty access-token renders a credentials notice.' },
  { title: 'Marker popup', description: 'Colored pin with a token-styled popup card.' },
  {
    title: 'Declarative source and layer',
    description: 'GeoJSON source with a nested circle layer, no imperative calls.',
  },
  { title: 'Minimal muted dashboard', description: 'Desaturated canvas, controls off, single accent pin.' },
]
