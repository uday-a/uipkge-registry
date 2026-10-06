import type { AngularStory } from './stories'

/** Story cards for the choropleth-map-chart Angular demo (titles + descriptions mirror demos/react/choropleth-map-chart.tsx). */
export const stories: AngularStory[] = [
  {
    title: 'Global internet adoption',
    description: 'World choropleth using Natural Earth 110m outlines. Continuous blue scale with full country coverage.',
  },
  {
    title: 'Binned classification',
    description:
      'Discrete classification intervals with an amber threshold palette. State abbreviations on regions, full names on hover.',
  },
  {
    title: 'Diverging growth scale',
    description: 'Three-color diverging palette centered at 0% to distinguish economic expansion from contraction.',
  },
  {
    title: 'Continuous sequential scale',
    description: 'European population across EU-27 and neighboring states. Countries without data render in neutral grey.',
  },
  {
    title: 'High-density regional map',
    description: 'Subdivision-level administrative mapping across 36 states and union territories.',
  },
  {
    title: 'Freight corridors and hubs',
    description: 'Pin markers with curved connection lines between logistics nodes.',
  },
]
