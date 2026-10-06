import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  { title: 'With icon action', description: 'Header action slot for invite/edit buttons.' },
  { title: 'Account settings', description: 'Full settings section with a save/cancel footer.' },
  { title: 'Without action', description: 'Title + description + content only.' },
  { title: 'Danger zone', description: 'Destructive sections get a tinted border and a danger action.' },
]
