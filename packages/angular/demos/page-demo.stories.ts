import type { AngularStory } from './stories'

/** Story cards for the page Angular demo (titles + descriptions mirror demos/react/page.tsx). */
export const stories: AngularStory[] = [
  {
    title: 'Default',
    description: 'Page layout with a header (title, description, action slot) and a card body region.',
  },
  {
    title: 'Multiple actions',
    description: 'Header actions slot accepts any number of buttons — filter, export, and primary CTA.',
  },
  {
    title: 'Body with grid',
    description: 'PageBody is a plain region — drop your own grid of cards inside.',
  },
  {
    title: 'Title only',
    description: 'Description is optional — drop it for compact pages.',
  },
  {
    title: 'With breadcrumb',
    description: 'Stack a Breadcrumb above the heading for nested-page navigation context.',
  },
]
