import type { AngularStory } from './stories'

/** Story cards for the line-chart Angular demo (titles mirror the React demo). */
export const stories: AngularStory[] = [
  {
    title: 'Basic line',
    description: 'Single-series line with point markers. Smooth interpolation is on by default in the wrapper.',
  },
  {
    title: 'Multi-series',
    description: 'Pass an array to y-field for parallel series; legend renders automatically.',
  },
  {
    title: 'Smooth, no markers',
    description: "Hide point dots when individual values aren't the focus — better for trend-only views.",
  },
  {
    title: 'Solid + dashed',
    description:
      'Mix line types: solid actual, dashed projection. The dashed variant tends to read as forecast or last-period.',
  },
  {
    title: 'Stepped',
    description:
      'Discrete-state visual — use when the metric only changes at tick boundaries (deploys, releases, threshold tiers).',
  },
  {
    title: 'Peak marker + target line',
    description:
      'markPoint highlights extrema; markLine draws a reference baseline. Both are stock ECharts features piped through the option prop.',
  },
  {
    title: 'Linear curves',
    description: 'Straight segments via the curve prop — no option override needed.',
  },
  {
    title: 'Step start',
    description: 'Step interpolation flavours (step, stepStart, stepEnd) for discrete metrics.',
  },
  {
    title: 'Stacked lines',
    description: 'Cumulative stacking as a first-class prop.',
  },
  {
    title: 'Dashed forecast',
    description: 'Dashed stroke plus hidden markers reads as projection.',
  },
  {
    title: 'Forecast vs flown, peak shading',
    description:
      'Air cargo demand: flown tonnage against forecast, with the Sep–Dec peak season shaded via markArea.',
  },
  {
    title: 'Lunar New Year window',
    description: 'Spot rates ($/kg) with the CNY capacity crunch marked — factories shut, belly space vanishes.',
  },
  {
    title: 'Capacity change points',
    description: "Diamond pins where freighters entered the lane — the aircargo app's change-point pattern.",
  },
]
