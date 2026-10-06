import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  { title: 'Default', description: 'Word-by-word staggered entrance on scroll into view.' },
  { title: 'Character mode', description: 'Finer-grained stagger, one character at a time.' },
  { title: 'No blur', description: 'Rise and fade without the blur pass.' },
  { title: 'Slow cinematic', description: 'Longer stagger and duration for hero headlines.' },
  { title: 'Paragraph', description: 'Body copy rendered as a paragraph element.' },
  { title: 'Replayable', description: 'Re-hides when scrolled away when once is false.' },
]
