import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  {
    title: 'Basic area',
    description: 'Single-series filled area chart with smooth interpolation.',
  },
  {
    title: 'Multi-series',
    description: 'Three series share the same x-axis. Legend appears automatically once you pass an array to yField.',
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
    title: 'Markers on',
    description: 'Dots on every point for sparse series where each value matters.',
  },
]
