import type { AngularStory } from './stories'

/** Story cards for the scatter-chart Angular demo (titles mirror the React demo). */
export const stories: AngularStory[] = [
  {
    title: 'Basic scatter',
    description: 'Plain XY scatter — pass `x-field` and `y-field` and that\'s it.',
  },
  {
    title: 'Bubble (sized)',
    description:
      'Pass `size-field` to scale each point by a third dimension. Sqrt-scaled internally to keep areas proportional, not radii.',
  },
  {
    title: 'Categorical color',
    description:
      'Pass `category-field` to split the data into one series per category. Each series gets its own chart-N colour and a shared legend.',
  },
  {
    title: 'Bubble + categorical',
    description: 'Combine all three: x, y, size, and category. Common for lifecycle / cohort charts.',
  },
  {
    title: 'With trend line',
    description:
      'Layer a markLine from start to end coordinates to anchor the reader to a regression or threshold. Pure option-prop override — no data restructuring.',
  },
  {
    title: 'Rate vs transit time',
    description: 'Air cargo lanes: days in transit against $/kg, bubble size is weekly tonnes, colour is region.',
  },
]
