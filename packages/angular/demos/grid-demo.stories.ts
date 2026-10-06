import type { AngularStory } from './stories'

/** Story cards for the grid Angular demo (titles + descriptions mirror demos/react/grid.tsx). */
export const stories: AngularStory[] = [
  {
    title: '3 columns',
    description: 'Three-column grid with a small gap.',
  },
  {
    title: '4 columns',
    description: 'Four-column grid with a larger gap.',
  },
  {
    title: 'Responsive',
    description:
      'Pass a breakpoint map for a layout that adapts: 1 column on phones, 2 on small tablets, 4 on desktop.',
  },
]
