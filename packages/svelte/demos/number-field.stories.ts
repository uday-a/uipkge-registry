import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  { title: 'Default', description: 'Steppers bounded by min and max.' },
  { title: 'Sizes', description: 'Small, middle (default), and large.' },
  { title: 'Status', description: 'Error and warning validation states.' },
  { title: 'Formatter / Parser', description: 'Currency display over a raw number.' },
  { title: 'Precision', description: 'Fixed fraction digits with a matching step.' },
  { title: 'Controls position right', description: 'Stacked steppers on the right edge.' },
  { title: 'Prefix & suffix', description: 'Affixed units around the input.' },
  { title: 'Min / Max bounds', description: 'Steppers disable at the bounds.' },
]
