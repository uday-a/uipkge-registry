import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  {
    title: 'Fixed size, 10k rows',
    description: 'Each row is exactly 40px tall. Renders only the visible window plus overscan.',
  },
  { title: 'Dynamic size', description: 'itemSize as a function returns per-item heights from the data.' },
  {
    title: 'Imperative scrollToIndex',
    description: 'Use a component ref to jump to any index, with align options.',
  },
  { title: 'Horizontal', description: "direction='horizontal' switches to a horizontal viewport." },
]
