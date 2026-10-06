import type { AngularStory } from './stories'

/** Story cards for the progress Angular demo (titles mirror demos/react/progress.tsx). */
export const stories: AngularStory[] = [
  { title: 'With label', description: 'Progress bar paired with label and percentage row above the track.' },
  { title: 'Discrete states', description: 'Empty, half, and complete tracks side by side.' },
  { title: 'Multi-percentage row', description: 'Static showcase across a typical 0–100 range.' },
  {
    title: 'Animated value',
    description: 'Reactive modelValue auto-cycles every 600ms; the indicator transitions smoothly.',
  },
  { title: 'In a card', description: 'Common use inside a card: title, description, and a labeled progress row.' },
]
