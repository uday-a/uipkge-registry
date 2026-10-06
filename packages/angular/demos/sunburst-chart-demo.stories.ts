import type { AngularStory } from './stories'

/** Story cards for the sunburst-chart Angular demo (titles mirror the React demo). */
export const stories: AngularStory[] = [
  {
    title: 'Revenue breakdown',
    description: 'Three-tier hierarchical share. Centre is the total; rings drill down by category.',
  },
  {
    title: 'Org chart',
    description:
      "Same component shape works for organisational structure — department → team → headcount. The size of each ring segment is proportional to the team's value.",
  },
  {
    title: 'Tangential labels',
    description:
      "Rotate inner-ring labels tangentially and push the outermost ring's labels outside the disc. Worth it when the inner ring text is being clipped.",
  },
  {
    title: 'Horizontal labels',
    description:
      "Drop the radial rotation. Labels read left-to-right on every ring — easier for non-technical audiences when the values aren't extreme.",
  },
  {
    title: 'Solid (pie-style)',
    description:
      "Use radius starting at 0 to close the centre hole. Reads more like a stacked pie than a donut — useful when there's no headline KPI to anchor the middle.",
  },
  {
    title: 'Cargo network',
    description: 'Air cargo tonnage: region, then airport. Transpacific dominates the disc.',
  },
]
