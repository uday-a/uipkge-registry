import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  {
    title: 'Daily OHLC',
    description:
      'Standard four-value candle: open / close / low / high. Teal renders bullish (close >= open); orange renders bearish.',
  },
  {
    title: 'With data-zoom',
    description:
      'Toggle the slider to scrub through longer time-series. Inside-zoom is on too, so mouse-wheel zoom works inside the plot area.',
  },
  {
    title: 'Bearish session',
    description:
      'Same shape, different colour balance. When close < open dominates, the canvas tilts toward the bearish hue — a fast visual cue for drawdown periods.',
  },
  {
    title: 'Weekly candles',
    description:
      'One candle per ISO week across a quarter. Aggregating daily into weekly OHLC smooths intra-week noise and lets longer trends emerge.',
  },
  {
    title: 'Sparkline-style',
    description:
      'Drop the gridlines and axis labels for inline placement next to a KPI. Strips it down to pure shape — works when the price scale is contextual.',
  },
]
