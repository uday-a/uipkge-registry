import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  { title: 'Default', description: 'Single-date calendar bound to a CalendarDate value.' },
  {
    title: 'Min / max',
    description: 'Restrict selection to a window — here, 7 days back through 30 days forward.',
  },
  {
    title: 'Disabled dates',
    description:
      'isDateUnavailable disables specific days (weekends here). Unavailable cells stay focusable for a11y but cannot be selected.',
  },
  {
    title: 'Multiple selection',
    description: "type='multiple' lets users pick several individual days. Value is an array of DateValue.",
  },
  {
    title: 'Range selection',
    description:
      "type='range' enables two-click start/end selection with hover preview. Value is a { start, end } DateValue range (React uses Date { from, to }).",
  },
  {
    title: 'Two months',
    description:
      'numberOfMonths=2 shows consecutive months in one calendar root (true multi-month, not two separate instances).',
  },
  {
    title: 'Month and year layout',
    description: "layout='month-and-year' turns the heading into native selects for fast jumps.",
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
    description: "Initialize bind:value with today() to mark today's cell as selected on mount.",
  },
  {
    title: 'Keyboard',
    description:
      'Focus the grid and use arrow keys to move, Space/Enter to select, PageUp/PageDown for months. Screen readers get the full date name from each cell.',
  },
]
