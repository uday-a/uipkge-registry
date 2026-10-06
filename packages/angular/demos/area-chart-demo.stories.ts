import type { AngularStory } from './stories'

/** Story cards for the area-chart Angular demo (titles + descriptions mirror demos/react/area-chart.tsx). */
export const stories: AngularStory[] = [
  {
    title: 'Basic area',
    description: 'Single-series filled area chart with smooth interpolation.',
  },
  {
    title: 'Multi-series',
    description:
      'Three series share the same x-axis. Legend appears automatically once you pass an array to y-field.',
  },
  {
    title: 'Stacked',
    description:
      'Pass `stack` on each series via the option escape hatch to stack values cumulatively. Areas turn opaque so segments are readable.',
  },
  {
    title: 'Gradient fill',
    description: 'Replace the default flat fill with a linear gradient that fades from chart-1 to transparent.',
  },
  {
    title: 'Stepped',
    description:
      'Right-stepped segments instead of smooth curves. Useful when the metric represents discrete state at each tick (price tier, plan slot).',
  },
  {
    title: 'Linear multi',
    description: 'Straight segments across all series via the curve prop.',
  },
  {
    title: 'Markers on',
    description: 'Dots on every point for sparse series where each value matters.',
  },
  {
    title: 'Stacked prop',
    description: 'Same cumulative stack as the override above, now as a one-word prop.',
  },
]
