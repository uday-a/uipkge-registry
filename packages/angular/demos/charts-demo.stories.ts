import type { AngularStory } from './stories'

/** Story cards for the charts Angular gallery (titles + descriptions mirror demos/vue/charts.vue). */
export const stories: AngularStory[] = [
  {
    title: 'Default',
    description: 'Full gallery — every chart family on one page, mirroring the Vue charts gallery.',
  },
  {
    title: 'Area chart',
    description: 'Smooth area chart with multiple series.',
  },
  {
    title: 'Bar chart',
    description: 'Vertical bars with rounded tops.',
  },
  {
    title: 'Line chart',
    description: 'Line chart with data point markers.',
  },
  {
    title: 'Pie chart',
    description: 'Donut chart showing percentage breakdown (hollow centre via the option escape hatch).',
  },
  {
    title: 'Radar chart',
    description: 'Multi-metric comparison on a radar grid.',
  },
  {
    title: 'Scatter chart',
    description: 'XY scatter. The Angular scatter has no category grouping input, so points render ungrouped.',
  },
  {
    title: 'Heatmap',
    description: 'Color-coded matrix with visual map legend.',
  },
  {
    title: 'Sparkline',
    description: 'Mini trend line without axes, perfect for dashboards.',
  },
  {
    title: 'Funnel chart',
    description: 'Stage-by-stage conversion with auto-shaded segments. Each entry is { name, value }.',
  },
  {
    title: 'Gauge chart',
    description: 'KPI gauge with green/amber/red threshold ramp. Single value plus an optional name label.',
  },
  {
    title: 'Treemap chart',
    description:
      'Hierarchical proportions. Flat array of { name, value }; pass a nested shape with `children` to get sub-trees.',
  },
  {
    title: 'Calendar heatmap',
    description:
      'GitHub-style yearly contribution grid. Pass [date, value] tuples; the [from, to] window comes from the option escape hatch.',
  },
  {
    title: 'Waterfall',
    description: 'Cashflow walk with signed deltas and a computed Total.',
  },
  {
    title: 'Combo bar + line',
    description: 'Bars on the left axis, smooth line on the right.',
  },
  {
    title: 'Polar bars',
    description: 'Radial bars on the polar coordinate system.',
  },
  {
    title: 'Pictorial bars',
    description: 'Repeated symbols fill to the value.',
  },
  {
    title: 'Effect scatter',
    description: 'Ripple animation for live points and alerts.',
  },
  {
    title: 'Bullets',
    description: 'KPI vs target with qualitative bands.',
  },
  {
    title: 'Liquid fill',
    description: 'Dependency-free SVG gauge with animated waves. Value is a 0–1 fraction.',
  },
  {
    title: 'Word cloud',
    description: 'Frequency-sized words, no extra dependencies.',
  },
  {
    title: 'Histogram',
    description: 'Distribution shape with an auto-highlighted peak.',
  },
  {
    title: 'Stacked bars',
    description: 'Part-to-whole per column with a shared legend.',
  },
  {
    title: 'Pareto',
    description: 'Sorted bars plus the cumulative % line.',
  },
  {
    title: 'Dumbbell',
    description: 'Before/after change per category.',
  },
  {
    title: 'Slope',
    description: 'Two-point rank shifts with end labels.',
  },
  {
    title: 'Gantt',
    description: 'Date ranges with progress shading.',
  },
  {
    title: 'Chord',
    description: 'Weighted flows around a circle.',
  },
  {
    title: 'Progress ring',
    description: 'Dependency-free SVG gauge.',
  },
  {
    title: 'Waffle',
    description: 'Each cell is 1% of the whole.',
  },
  {
    title: 'Quadrant',
    description: 'Median-split 2×2 strategy matrix.',
  },
  {
    title: 'Raw chart — full ECharts API escape hatch',
    description:
      'Pass any ECharts option object and render anything ECharts supports (sankey, sunburst, graph, candlestick, themeRiver, custom, …).',
  },
]
