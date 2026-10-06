import type { AngularStory } from './stories'

/** Story cards for the raw-chart Angular demo (titles mirror the React demo). */
export const stories: AngularStory[] = [
  {
    title: 'Sankey — flow diagram',
    description:
      'Source → target → outcome flows with link widths proportional to value. ECharts type that uipkge does not wrap as an opinionated component; RawChart is the answer.',
  },
  {
    title: 'Sunburst — hierarchical share',
    description:
      "Nested concentric ring chart. Pair it with a treemap when readers want both 'shape of the tree' and 'comparative size of each branch'.",
  },
  {
    title: 'Candlestick — OHLC price series',
    description: 'Bullish (teal) and bearish (orange) candles. The classic financial chart type, served straight from ECharts.',
  },
  {
    title: 'Network graph — force-directed',
    description:
      'Six services, six edges, force layout. Good fit for service-dependency graphs, social maps, knowledge bases.',
  },
  {
    title: 'Boxplot — distribution',
    description:
      "Five-number summary (min / Q1 / median / Q3 / max) per category. Drop this in when raw values aren't useful but the shape of the spread is.",
  },
]
