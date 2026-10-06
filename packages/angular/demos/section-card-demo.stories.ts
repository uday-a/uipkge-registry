import type { AngularStory } from './stories'

/** Story cards for the section-card Angular demo (titles + descriptions mirror demos/react/section-card.tsx). */
export const stories: AngularStory[] = [
  {
    title: 'With icon action',
    description: 'Labeled card with title, description, and a single icon in the corner action slot.',
  },
  {
    title: 'Without action',
    description: 'Header-action slot is optional — drop it for plain titled sections.',
  },
  {
    title: 'Multiple actions',
    description: 'The header-action slot accepts any node — group buttons in a flex container.',
  },
  {
    title: 'Stacked sections',
    description: 'Multiple SectionCards stacked vertically — a typical settings-page pattern.',
  },
  {
    title: 'With form content',
    description: 'Drop labels and inputs into the body — pairs naturally with form primitives.',
  },
]
