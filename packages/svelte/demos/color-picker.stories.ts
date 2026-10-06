import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  { title: 'Default', description: 'Trigger, hex field, and preset swatches with a two-way bindable value.' },
  { title: 'Side by side', description: 'Compact pickers without the hex field for theme editors.' },
  { title: 'Disabled', description: 'Non-interactive state for read-only contexts.' },
  { title: 'Custom presets', description: 'Override the swatch row with brand colors.' },
  { title: 'In a form', description: 'Labelled picker inside a project settings form.' },
]
