import type { AngularStory } from './stories'

/** Story cards for the input Angular demo (titles mirror demos/react/input.tsx). */
export const stories: AngularStory[] = [
  { title: 'Default', description: 'Two-way bound with value/onChange. Plain text input with label.' },
  { title: 'Sizes', description: 'Three heights: small, middle (default), and large.' },
  { title: 'Variants', description: 'Outlined, filled, and borderless backgrounds.' },
  { title: 'Status', description: 'Error and warning visual states via the status prop.' },
  { title: 'Prefix & Suffix', description: 'String or node content rendered inside the input wrapper.' },
  { title: 'Addon before & after', description: 'Input group styling with addon segments.' },
  { title: 'Allow clear', description: 'Shows an X icon when the input has value and is focused or hovered.' },
  { title: 'Show count', description: 'Displays character count when maxLength is set.' },
  { title: 'Password toggle', description: 'Eye icon to toggle password visibility.' },
  { title: 'Disabled & Readonly', description: 'Non-interactive states with full styling.' },
  {
    title: 'Composite Input Groups',
    description: 'Seamless input wrappers with prefix addons, copy buttons, and action triggers.',
  },
]
