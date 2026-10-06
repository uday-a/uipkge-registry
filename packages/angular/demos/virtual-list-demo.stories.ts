import type { AngularStory } from './types'

export const stories: AngularStory[] = [
  {
    title: 'Fixed size, 10k rows',
    description: 'Each row is exactly 40px tall. Renders only the visible window plus overscan.',
  },
  {
    title: 'Dynamic size',
    description: 'itemSize as a function returns per-item heights from the data.',
  },
  {
    title: 'Imperative scrollToIndex',
    description: 'Use a template ref to jump to any index, with align options.',
  },
  {
    title: 'Horizontal',
    description: "direction='horizontal' switches to a horizontal viewport.",
  },
]
