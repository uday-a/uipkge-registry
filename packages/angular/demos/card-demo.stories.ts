import type { AngularStory } from './stories'

/** Story cards for the card Angular demo (titles + descriptions mirror demos/react/card.tsx). */
export const stories: AngularStory[] = [
  {
    title: 'Simple',
    description: 'Header (title + description) plus content.',
  },
  {
    title: 'With footer actions',
    description: 'CardFooter slot for save/cancel patterns.',
  },
  {
    title: 'With header action',
    description: 'Secondary action in the top-right corner.',
  },
  {
    title: 'Pricing card',
    description: 'Highlighted with border-primary. Badge in the header denotes recommendation.',
  },
]
