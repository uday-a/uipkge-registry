import type { AngularStory } from './stories'

/** Story cards for the number-field Angular demo (titles mirror demos/react/number-field.tsx). */
export const stories: AngularStory[] = [
  {
    title: 'Default',
    description: 'Basic numeric input with increment and decrement buttons, bounded by min and max.',
  },
  { title: 'Sizes', description: 'Small, middle (default), and large sizes.' },
  { title: 'Status', description: 'Error and warning validation states.' },
  { title: 'Formatter / Parser', description: 'Display formatting with custom formatter and parser functions.' },
  { title: 'Precision', description: 'Fixed decimal places using the precision prop.' },
  { title: 'Controls position right', description: 'Stacked increment and decrement buttons on the right.' },
  { title: 'Keyboard disabled', description: 'Arrow keys do not change the value when keyboard is false.' },
  { title: 'Prefix & Suffix', description: 'Add text or icons before and after the input value.' },
  { title: 'Min / Max bounds', description: 'Buttons visually disable when reaching boundaries.' },
  { title: 'Disabled & Read-only', description: 'Non-interactive states.' },
]
