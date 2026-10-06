import type { AngularStory } from './stories'

/** Story cards for the breadcrumb Angular demo (titles + descriptions mirror demos/react/breadcrumb.tsx). */
export const stories: AngularStory[] = [
  {
    title: 'Default',
    description: 'Links + a final non-link page entry. BreadcrumbSeparator auto-renders a chevron between items.',
  },
  {
    title: 'With leading icon',
    description: 'Wrap a Lucide icon in BreadcrumbLink for an iconic Home root.',
  },
  {
    title: 'Custom separator',
    description:
      'Slot any node into BreadcrumbSeparator to override the default chevron — slash, dot, or anything else.',
  },
  {
    title: 'Long path with ellipsis',
    description: 'Use BreadcrumbEllipsis to collapse middle segments visually.',
  },
  {
    title: 'Ellipsis with dropdown',
    description: 'Wrap BreadcrumbEllipsis in a DropdownMenu to expose the collapsed segments on click.',
  },
  {
    title: 'Responsive truncation',
    description: 'Combine hidden / md:inline classes to drop interior segments on small screens — try resizing.',
  },
]
