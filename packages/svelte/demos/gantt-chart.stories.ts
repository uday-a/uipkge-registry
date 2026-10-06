import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  { title: 'Launch plan', description: 'Date ranges on a time axis; darker fill marks progress.' },
  { title: 'Machine schedule', description: 'Groups share palette slots automatically.' },
  { title: 'Milestones', description: 'Diamond markers pinned to tasks for gates and releases.' },
  {
    title: 'Today line',
    description: 'Dashed reference for the current date (pass explicitly for SSR-safe renders).',
  },
  {
    title: 'Peak charter program',
    description: 'Freighter rotations locked for peak season, with the rate-gate milestone.',
  },
]
