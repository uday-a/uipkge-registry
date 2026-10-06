import type { AngularStory } from './stories'

/** Story cards for the tags-input Angular demo (titles + descriptions mirror demos/react/tags-input.tsx). */
export const stories: AngularStory[] = [
  {
    title: 'Default',
    description: 'Free-text input that converts entries into removable tag chips.',
  },
  {
    title: 'Add on paste',
    description: 'Pasting splits on whitespace and adds each token as a tag.',
  },
  {
    title: 'Custom delimiter',
    description: 'Use the delimiter prop to split on commas instead of Enter.',
  },
  {
    title: 'Max length',
    description: 'Cap the total number of tags via the max prop.',
  },
  {
    title: 'Disabled',
    description: 'Disabled state hides the input and prevents tag removal.',
  },
]
