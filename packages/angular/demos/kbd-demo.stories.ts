import type { AngularStory } from './stories'

/** Story cards for the kbd Angular demo (titles + descriptions mirror demos/react/kbd.tsx). */
export const stories: AngularStory[] = [
  {
    title: 'Default',
    description: 'Inline keyboard hint styled with muted surface and mono font.',
  },
  {
    title: 'Single key',
    description: 'One-letter shortcuts for arrow keys and modifiers.',
  },
  {
    title: 'Modifier combos',
    description: 'Group related keys inline — each key is its own chip.',
  },
  {
    title: 'In a button row',
    description: 'Pair with Button for shortcut affordances on toolbars.',
  },
  {
    title: 'Long label',
    description: 'Chips grow with content — no truncation on wider labels.',
  },
]
