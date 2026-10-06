import type { AngularStory } from './stories'

/** Story cards for the calendar-heatmap Angular demo (titles + descriptions mirror demos/react/calendar-heatmap.tsx). */
export const stories: AngularStory[] = [
  {
    title: 'Yearly contribution grid',
    description: '365-day rolling window. Default amber ramp. Each tooltip shows the date + value.',
  },
  {
    title: 'Quarter view',
    description:
      'Same data, narrower range — quarter-sized window. Useful for review cycles, sprint retrospectives.',
  },
  {
    title: 'Teal palette',
    description:
      'Pass `color-range` to override the cell ramp. Two-stop linear gradient between the two given colours.',
  },
  {
    title: 'Blue palette',
    description: 'GitHub-style blues. Goes well with dark themes.',
  },
  {
    title: 'Single month',
    description:
      'Tighten to a 31-day window for sprint reviews or release retrospectives. Each cell is bigger, so the day labels stay legible without zoom.',
  },
  {
    title: 'Freighter operating days',
    description:
      'Air cargo rotations per day — blank cells are maintenance groundings. The operating-days pattern from freight visibility apps.',
  },
]
