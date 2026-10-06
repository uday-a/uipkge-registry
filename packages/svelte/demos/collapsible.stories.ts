import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  {
    title: 'Controlled',
    description: 'Two-way bound open state with the current value rendered alongside.',
  },
  {
    title: 'Uncontrolled',
    description: 'defaultOpen sets the initial state — the component manages it internally.',
  },
  {
    title: 'Button trigger',
    description: 'Using the child snippet lets the trigger forward props onto a custom Button.',
  },
  { title: 'Long content', description: 'Wraps a larger block of nested rows that toggle as one unit.' },
  {
    title: 'Animated chevron rotation',
    description:
      'The children snippet exposes the open state, so the trigger icon can rotate as the content reveals. Pure CSS transition on a single class.',
  },
]
