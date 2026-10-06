import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  {
    title: 'Month View',
    description: 'Full month grid featuring multi-day pills, timed chips, and overflow popovers for busy dates.',
  },
  {
    title: 'Week View with Intervals',
    description:
      '7-day schedule with hourly time intervals, pinned all-day row, and automatic side-by-side lane splitting for overlapping events.',
  },
  {
    title: 'Day View',
    description: 'Single-day agenda focusing on detailed hourly intervals and precise event durations.',
  },
  {
    title: 'Category / Resource View',
    description: 'Side-by-side multi-column scheduling across conference rooms, team members, or equipment.',
  },
  {
    title: 'Custom Event Template',
    description: 'Custom event rendering using the event snippet with visual pins and badges.',
  },
]
