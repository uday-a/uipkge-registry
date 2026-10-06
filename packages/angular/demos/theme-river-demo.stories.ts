import type { AngularStory } from './stories'

/** Story cards for the theme-river Angular demo (titles mirror the React demo). */
export const stories: AngularStory[] = [
  {
    title: 'Topic volume over time',
    description:
      'Stacked streams centred on a baseline. Vertical thickness shows volume for each topic at every tick.',
  },
  {
    title: 'Channel acquisition over weeks',
    description:
      'Weekly buckets render the same way; ECharts spaces the ticks by the time axis. Useful for marketing breakdowns where total volume tells one story and share tells another.',
  },
  {
    title: 'Release-week sentiment',
    description:
      'Three streams (Positive / Neutral / Negative) across a tight 7-day window. Tight ranges make the relative widths read as percentages even though the y-axis is absolute.',
  },
  {
    title: 'No legend',
    description:
      'When the surrounding copy already names the streams, drop the legend with option.legend.show=false to reclaim the bottom margin.',
  },
  {
    title: 'Compact',
    description:
      'A shorter height for aside placement. Theme-river degrades gracefully — stream proportions stay readable down to ~160px.',
  },
]
