import type { AngularStory } from './stories'

/** Story cards for the list Angular demo (titles + descriptions mirror demos/react/list.tsx). */
export const stories: AngularStory[] = [
  {
    title: 'Default',
    description: 'Vertical list with two-line items and a trailing chevron, suitable for settings menus.',
  },
  {
    title: 'With subheaders',
    description: 'ListSubheader groups items into labeled sections inside a single list.',
  },
  {
    title: 'Active state',
    description: 'Set active on a ListItem to highlight the current selection.',
  },
  {
    title: 'Disabled state',
    description: 'Disabled items are dimmed and ignore pointer events.',
  },
  {
    title: 'Anchor links',
    description: 'Render items as anchors by setting the as prop on List and ListItem.',
  },
  {
    title: 'Structured Item Rows',
    description: 'Compound ListItemMedia, ListItemContent, and ListItemActions for settings and rich list feeds.',
  },
]
