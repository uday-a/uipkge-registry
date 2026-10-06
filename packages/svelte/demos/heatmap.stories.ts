import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  {
    title: 'Basic heatmap',
    description: '5×4 grid (day-of-week × time-of-day). Default blue ramp + bottom visualMap legend.',
  },
  {
    title: 'With gaps',
    description:
      'Low-value cells are still rendered but visually quieter — the borderRadius + border carve them out into discrete tiles.',
  },
  {
    title: 'Teal palette',
    description: 'Override the default cool-blue ramp with a custom green / teal scale via the option escape hatch.',
  },
  {
    title: 'Warm palette',
    description: 'Same data, orange-to-burnt ramp. Useful when the axis communicates intensity rather than coolness.',
  },
  {
    title: 'Compact (no legend)',
    description:
      'Drop the visualMap legend and shrink the height for in-card placement next to a KPI. Tooltip still shows the exact value on hover.',
  },
  {
    title: 'Lane load factors',
    description: 'Air cargo belly fill by lane and week — watch the peak-season ramp into W27.',
  },
]
