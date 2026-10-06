import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  { title: 'Default', description: 'Two-handle slider for selecting a numeric range bounded by min and max.' },
  { title: 'With ticks', description: 'Render tick marks at regular intervals with showTicks and tickInterval.' },
  {
    title: 'Custom step + tick interval',
    description: 'Quantize values with step and align ticks to a different interval.',
  },
  {
    title: 'Always-visible thumb labels',
    description: 'Pass thumbLabel to keep the value bubble pinned above each handle.',
  },
  {
    title: 'Custom format (currency)',
    description: 'Use thumbLabelFormat to render formatted values in the thumb bubble.',
  },
  { title: 'Color variants', description: 'Use the color prop to recolor the active range.' },
  { title: 'Sizes', description: 'Combine thumbSize and trackHeight to scale the slider up or down.' },
  { title: 'With label and hint', description: 'Pass label and hint props for an embedded form-field layout.' },
  { title: 'Error state', description: 'Set error or pass errorMessages to surface validation issues.' },
  { title: 'Disabled', description: 'Lock the slider via disabled.' },
  { title: 'Inverted', description: 'Flip the active range direction with inverted.' },
]
