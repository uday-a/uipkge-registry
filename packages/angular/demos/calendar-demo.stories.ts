import type { AngularStory } from './stories'

/** Story cards for the calendar Angular demo (titles + descriptions mirror demos/react/calendar.tsx). */
export const stories: AngularStory[] = [
  {
    title: 'Default',
    description: 'Single-date calendar bound to a Date value.',
  },
  {
    title: 'Min / max',
    description: 'Restrict selection to a window — here, 7 days back through 30 days forward.',
  },
  {
    title: 'Disabled dates',
    description:
      'disabled matcher disables specific days (weekends here). Unavailable cells stay focusable for a11y but cannot be selected.',
  },
  {
    title: 'Multiple selection',
    description: "mode='multiple' lets users pick several individual days. Value is an array of Date.",
  },
  {
    title: 'Two months',
    description:
      'numberOfMonths=2 shows consecutive months in one calendar root (true multi-month, not two separate instances).',
  },
  {
    title: 'Month and year layout',
    description: 'react-day-picker caption layout — use captionLayout for month/year dropdowns when available.',
  },
  {
    title: 'Side-by-side months',
    description: 'Render two Calendar instances next to each other for parallel month browsing.',
  },
  {
    title: 'Locale variants',
    description: 'Pass locale to localize weekday labels, month names, and first day of week.',
  },
  {
    title: 'Pre-selected today',
    description: "Initialize state with new Date() to mark today's cell as selected on mount.",
  },
  {
    title: 'Keyboard',
    description: 'Focus the grid and use arrow keys to move, Space/Enter to select, PageUp/PageDown for months.',
  },
]
