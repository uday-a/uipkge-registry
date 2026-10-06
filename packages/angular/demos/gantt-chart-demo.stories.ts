import type { AngularStory } from './stories'

/** Story cards for the gantt-chart Angular demo (titles mirror the React demo). */
export const stories: AngularStory[] = [
  {
    title: 'Launch plan',
    description: 'Date ranges on a time axis; darker fill marks progress.',
  },
  {
    title: 'Milestones',
    description: 'Diamond markers pinned to tasks for gates and releases.',
  },
  {
    title: 'Today line',
    description: 'Dashed reference for the current date (pass explicitly for SSR-safe renders).',
  },
  {
    title: 'Peak charter program',
    description: 'Freighter rotations locked for peak season, with the rate-gate milestone.',
  },
]
