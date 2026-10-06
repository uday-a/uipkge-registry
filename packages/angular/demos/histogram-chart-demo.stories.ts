import type { AngularStory } from './stories'

/** Story cards for the histogram-chart Angular demo (titles mirror the React demo). */
export const stories: AngularStory[] = [
  {
    title: 'Auto-binned',
    description: 'Pass raw values plus a bin count; the peak bin highlights.',
  },
  {
    title: 'Pre-binned',
    description: 'Pass { bin, count } rows when you aggregate server-side.',
  },
]
