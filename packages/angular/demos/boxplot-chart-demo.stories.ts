import type { AngularStory } from './stories'

/** Story cards for the boxplot-chart Angular demo (titles + descriptions mirror demos/react/boxplot-chart.tsx). */
export const stories: AngularStory[] = [
  {
    title: 'Vertical box plot',
    description:
      'Five-number summary per region — min, Q1, median, Q3, max. Whiskers show the full range; the box shows the IQR.',
  },
  {
    title: 'Horizontal',
    description:
      'Same data, rotated. Categories on the y-axis read better when names are long or there are more than ~6 of them.',
  },
  {
    title: 'A/B/C cohort scores',
    description:
      "Three cohorts with overlapping but distinct distributions. Box plots tell you 'is the spread different' faster than histograms because the medians line up at a glance.",
  },
  {
    title: 'Build times by tier (long-tail risk)',
    description:
      'Widening IQR as the artifact tier grows surfaces tail risk — a tiny number of XL builds taking 10+ minutes drags the whole pipeline.',
  },
  {
    title: 'Compact / no gridlines',
    description:
      'Strip the split lines and tighten the grid for inline placement next to a KPI. Works when the chart anchors to a single takeaway, not exact values.',
  },
]
