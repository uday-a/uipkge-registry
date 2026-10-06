import type { AngularStory } from './stories'

/** Story cards for the funnel-chart Angular demo (titles mirror the React demo). */
export const stories: AngularStory[] = [
  {
    title: 'Basic funnel',
    description: 'Stage-by-stage drop-off. Default sort is descending — biggest stage at top.',
  },
  {
    title: 'With legend',
    description: 'Toggle the bottom legend with `show-legend`. Lets users isolate / toggle stages on click.',
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
