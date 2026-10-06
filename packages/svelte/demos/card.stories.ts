import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  { title: 'Simple', description: 'Header (title + description) plus content.' },
  { title: 'With footer actions', description: 'CardFooter slot for save/cancel patterns.' },
  { title: 'With header action', description: 'Secondary action in the top-right corner.' },
  {
    title: 'Pricing card',
    description: 'Highlighted with border-primary. Badge in the header denotes recommendation.',
  },
]
