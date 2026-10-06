import type { AngularStory } from './stories'

/** Story cards for the labeled-value Angular demo (titles + descriptions mirror demos/react/labeled-value.tsx). */
export const stories: AngularStory[] = [
  {
    title: 'Default grid',
    description: 'Horizontal label/value pairs arranged in a responsive three-column grid.',
  },
  {
    title: 'Vertical stack',
    description: 'Single-column layout suitable for narrow detail panels and sidebars.',
  },
  {
    title: 'Custom value via slot',
    description: 'The default slot replaces the value text — drop in a Badge, icon row, or any composition.',
  },
  {
    title: 'Truncated long values',
    description: 'Long text gets truncated to keep the row aligned in tight layouts.',
  },
  {
    title: 'With copy-button trailing',
    description: 'Pair a monospace value with a copy button to expose secrets and IDs.',
  },
]
