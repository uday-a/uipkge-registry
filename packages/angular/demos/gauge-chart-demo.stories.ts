import type { AngularStory } from './stories'

/** Story cards for the gauge-chart Angular demo (titles mirror the React demo). */
export const stories: AngularStory[] = [
  {
    title: 'Stoplight gauge',
    description: 'Default teal → amber → red threshold ramp. Single value, 0–100, with optional unit and label.',
  },
  {
    title: 'Custom thresholds',
    description: "Pass any `[stop, color]` array. Here, a brand-green ramp for a 'distance covered' style gauge.",
  },
  {
    title: 'Progress ring',
    description:
      'Override `axisLine` and hide the pointer for a circular progress indicator — useful in tighter dashboard tiles.',
  },
  {
    title: 'Multi-needle',
    description:
      'Two needles on the same axis — current vs. target, paced vs. plan. Pass a `data` array of {value, name} in the option override.',
  },
  {
    title: 'Compact KPI tile',
    description:
      'Constrained height + width for dashboard tile placement. Keep one gauge per tile so the headline reads instantly.',
  },
]
