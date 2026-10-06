import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  {
    title: 'Default',
    description: 'Five-slide horizontal carousel with previous and next controls.',
  },
  {
    title: 'Vertical orientation',
    description: 'Stacks slides top-to-bottom with controls on the vertical axis.',
  },
  {
    title: 'With loop',
    description: 'Wraps from the last slide back to the first when navigating past the end.',
  },
  {
    title: 'With indicators',
    description: 'Dot navigation rendered in the footer keeps the active slide visible at a glance.',
  },
  {
    title: 'Header and footer',
    description: 'Caption layout with a titled header and grouped controls in the footer.',
  },
  {
    title: 'Image cards',
    description: 'Image-based slide content with overlay caption inside each carousel item.',
  },
]
