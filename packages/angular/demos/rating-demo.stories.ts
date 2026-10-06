import type { AngularStory } from './stories'

/** Story cards for the rating Angular demo (titles mirror demos/react/rating.tsx). */
export const stories: AngularStory[] = [
  { title: 'Default', description: 'Star rating input with half-step support up to a max of five.' },
  { title: 'Sizes', description: 'Five sizes from x-small to x-large.' },
  { title: 'Variants', description: 'Outlined (default), filled, and soft background variants.' },
  { title: 'Custom max', description: 'Change the number of stars with the max prop.' },
  { title: 'Read-only', description: 'Non-interactive display of an existing score.' },
  { title: 'Disabled', description: 'Visually muted and non-interactive.' },
  { title: 'Clearable', description: 'Click the currently selected star to reset to zero.' },
  { title: 'Show value', description: 'Display the current numeric value next to the stars.' },
  { title: 'With tooltips', description: 'Provide one tooltip per star via the tooltips array.' },
  { title: 'Integer-only', description: 'Omit halfIncrements to restrict input to whole stars.' },
  { title: 'Hover effect', description: 'Stars scale up on hover for stronger feedback.' },
]
