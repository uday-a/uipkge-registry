import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  { title: 'Default', description: 'Two-way bound with bind:value. Plain text input with label.' },
  { title: 'Sizes', description: 'Three heights: small, middle (default), and large.' },
  { title: 'Variants', description: 'Outlined, filled, and borderless backgrounds.' },
  { title: 'Status', description: 'Error and warning visual states via the status prop.' },
  { title: 'Prefix & Suffix', description: 'String or icon content rendered inside the input wrapper.' },
  { title: 'Addon before & after', description: 'Input group styling with addon segments.' },
  {
    title: 'Allow clear',
    description: 'Shows an X icon when the input has value and is focused or hovered.',
  },
  { title: 'Show count', description: 'Displays character count when maxlength is set.' },
  { title: 'Password toggle', description: 'Eye icon to toggle password visibility.' },
  { title: 'Disabled & Readonly', description: 'Non-interactive states with full styling.' },
  { title: 'Input group', description: 'Composite group with addons and action buttons.' },
]
