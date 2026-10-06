import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  { title: 'Default', description: 'Label, placeholder, and hint with the standard ring treatment.' },
  { title: 'Auto size', description: 'Grows with content when autoSize is enabled.' },
  { title: 'Auto size with min & max rows', description: 'Clamp the auto-grown height between row counts.' },
  { title: 'Show count', description: 'Live character count in the corner.' },
  { title: 'Max length with show count', description: 'Count turns red past maxLength.' },
  { title: 'Allow clear', description: 'One-click clear button when there is content.' },
  { title: 'Disabled & Readonly', description: 'Non-editable states.' },
  { title: 'Variants', description: 'Outlined, filled, and underlined styles.' },
]
