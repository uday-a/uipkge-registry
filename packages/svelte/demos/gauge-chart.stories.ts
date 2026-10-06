import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
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
