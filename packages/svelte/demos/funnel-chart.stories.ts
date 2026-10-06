import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  {
    title: 'Basic funnel',
    description: 'Stage-by-stage drop-off. Default sort is descending — biggest stage at top.',
  },
  {
    title: 'With legend',
    description: 'Toggle the bottom legend with `showLegend`. Lets users isolate / toggle stages on click.',
  },
  {
    title: 'Inverted',
    description: '`sort: ascending` inverts the funnel for processes that broaden over time (lead-gen, growth flows).',
  },
  {
    title: 'With conversion %',
    description: 'Custom label includes stage-to-total percentage. Quick to read drop-off without doing the math.',
  },
  {
    title: 'Compact dashboard tile',
    description:
      'Shorter height for in-card placement. Drop the labels via option.label.show=false so the tile reads as a sparkline-style funnel.',
  },
]
