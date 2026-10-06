import type { AngularStory } from './stories'

/** Story cards for the bar-chart Angular demo (titles + descriptions mirror demos/react/bar-chart.tsx). */
export const stories: AngularStory[] = [
  {
    title: 'Vertical bars',
    description: 'Default orientation. Rounded tops and a 32px max width keep wide bars readable.',
  },
  {
    title: 'Horizontal bars',
    description:
      'Swap xAxis and yAxis types via the option escape hatch to flip orientation. Great for long category labels.',
  },
  {
    title: 'Grouped',
    description: 'Pass an array to y-field to render side-by-side groups. Legend auto-appears.',
  },
  {
    title: 'Stacked',
    description: 'Same multi-series data as above, stacked on a shared key via the option override.',
  },
  {
    title: 'Negative values',
    description: 'Diverging bars around zero. Per-bar colour callback flips positive vs. negative.',
  },
  {
    title: 'Value labels',
    description: 'Exact numbers on top of every bar for glanceable decks.',
  },
  {
    title: 'Stacked prop',
    description: 'One-word stacking without the series override.',
  },
  {
    title: 'Carrier tonnage, MTD shading',
    description: "Weekly uplift by carrier with the month-to-date window boxed — the app's MTD-interval pattern.",
  },
]
