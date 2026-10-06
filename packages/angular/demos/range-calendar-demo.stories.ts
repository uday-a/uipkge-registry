import type { AngularStory } from './stories'

/** Story cards for the range-calendar Angular demo (titles + descriptions mirror demos/react/range-calendar.tsx). */
export const stories: AngularStory[] = [
  {
    title: 'Default',
    description: 'Calendar that selects a start and end date inclusive of the range between them.',
  },
  {
    title: 'Min / max',
    description: 'Constrain the selectable window — here, 14 days back through 60 days forward.',
  },
  {
    title: 'Fixed weeks',
    description: 'fixed-weeks always renders 6 rows so the calendar height never shifts month-to-month.',
  },
  {
    title: 'Week starts Monday',
    description: 'weekStartsOn=1 (Monday) for ISO/EU calendars instead of the default Sunday start.',
  },
  {
    title: 'Pre-selected range',
    description: 'Initialize v-model with a {start, end} pair to highlight a default range on mount.',
  },
]
