import type { AngularStory } from './stories'

/** Story cards for the kpi-grid Angular demo (titles + descriptions mirror demos/react/kpi-grid.tsx). */
export const stories: AngularStory[] = [
  {
    title: 'Default — four explicit tiles',
    description:
      'KpiGrid is just a responsive grid container (2 / 3 / 4 columns). You compose each tile inline as a Card so the call-site reads top-to-bottom with no hidden item rendering.',
  },
  {
    title: 'Three columns',
    description: 'Use the columns prop to change density. Accepts 2, 3, or 4.',
  },
  {
    title: 'Mixed tile shapes',
    description:
      'Children are arbitrary — drop in a Card with an inline Sparkline, a chart-led layout, a custom dashed tile, or anything else. KpiGrid only owns the grid.',
  },
  {
    title: 'Two tiles',
    description:
      'Single, double, triple — however many children you pass, the grid wraps responsively. Below: just two.',
  },
  {
    title: 'Sparkline-led tiles',
    description:
      'When the trend matters more than the absolute value, lead with the sparkline and pin the label + value at the top. Same grid container — what changes is the tile composition.',
  },
]
