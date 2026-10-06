import type { AngularStory } from './stories'

/** Story cards for the sankey-chart Angular demo (titles mirror the React demo). */
export const stories: AngularStory[] = [
  {
    title: 'Acquisition funnel',
    description: 'Marketing channel → page → outcome. Link widths track value flow; hover highlights adjacency.',
  },
  {
    title: 'Energy mix',
    description: 'Source → carrier → end-use. Same shape as a Sankey diagram in an annual report.',
  },
  {
    title: 'Budget allocation',
    description: "Revenue → department → line item. Sankey reads as 'where does the money go' at a glance.",
  },
  {
    title: 'Straight ribbons',
    description:
      'Drop the curveness for a strict left-to-right read. Useful for very wide diagrams where curves create visual noise.',
  },
  {
    title: 'Compact flow',
    description:
      'Shorter height for in-card placement — works when the diagram has ≤8 nodes and the focus is on the dominant flow paths, not the small ones.',
  },
  {
    title: 'Lane flows',
    description: 'Air cargo tonnage from origin gateways to destination ramps.',
  },
]
