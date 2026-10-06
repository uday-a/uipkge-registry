import type { AngularStory } from './stories'

/** Story cards for the sparkline Angular demo (titles mirror the React demo). */
export const stories: AngularStory[] = [
  {
    title: 'Trend up',
    description: 'Default line sparkline with gradient fill. Sized for inline use next to a KPI number.',
  },
  {
    title: 'Trend down (custom color)',
    description:
      'Pass a single `color` to override the default teal — useful to encode direction without re-styling everything.',
  },
  {
    title: 'Flat trend',
    description:
      "Low-variance series. Sparkline still renders a faint area, which tells the reader 'no meaningful change'.",
  },
  {
    title: 'Bar sparkline',
    description:
      'Same data, but the option escape hatch swaps the series type to `bar` for a categorical-feeling micro-chart.',
  },
  {
    title: 'Win / loss',
    description: 'A ±1 sequence rendered as up-vs-down bars. Classic streak visualization for tests, releases, AB cohorts.',
  },
]
