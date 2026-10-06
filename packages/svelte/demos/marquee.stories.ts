import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  {
    title: 'Horizontal (default)',
    description: 'Content scrolls leftward. The slot is duplicated for a seamless loop.',
  },
  { title: 'Direction right', description: "direction='right' reverses the travel direction." },
  { title: 'Speed', description: 'speed is the animation duration in seconds. Lower = faster.' },
  { title: 'Pause on hover', description: 'Hover the row to freeze the animation.' },
  { title: 'Vertical', description: 'orientation="vertical" scrolls upward instead.' },
]
