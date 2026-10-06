import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  { title: 'With input', description: 'Label paired with an Input via matching for/id attributes.' },
  {
    title: 'Required and invalid',
    description: 'Destructive-colored label with required asterisk paired with an aria-invalid input.',
  },
  {
    title: 'Inline with checkbox',
    description: 'Muted label sitting next to a checkbox, linked via for/id.',
  },
]
