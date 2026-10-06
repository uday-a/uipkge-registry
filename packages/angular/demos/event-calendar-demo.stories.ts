import type { AngularStory } from './stories'

/** Story cards for the event-calendar Angular demo (titles mirror demos/react/event-calendar.tsx). */
export const stories: AngularStory[] = [
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
    description: 'Custom event rendering using the renderEvent prop with visual pins and badges.',
  },
]
