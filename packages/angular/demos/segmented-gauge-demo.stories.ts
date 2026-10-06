import type { AngularStory } from './stories'

/** Story cards for the segmented-gauge Angular demo (titles mirror the React demo). */
export const stories: AngularStory[] = [
  {
    title: 'Browser share',
    description:
      'Four colored segments with a 4-degree gap and rounded line caps. Use the `center` slot to drop a KPI value + label into the dish.',
  },
  {
    title: 'Regional split',
    description:
      'Same shape, different domain. The default colors come from the registry palette; pass `color` per-segment when the brand colors need to win.',
  },
  {
    title: 'Sentiment tri-band',
    description:
      'Three segments scaled by their relative share. Segments are normalised internally so the input values can be raw counts or percentages.',
  },
  {
    title: 'Wider stroke, no track',
    description:
      'Bump stroke to 28 and turn off the background track for a pill-cluster look — works when the chart sits on a dark surface and the muted track would compete with the segments.',
  },
  {
    title: 'Compact',
    description:
      'Shorter height + no center slot for sparkline-style placement next to a metric label. The arc proportions stay readable down to ~100px.',
  },
]
