import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  {
    title: 'Basic pie',
    description: 'Solid pie with bottom legend. Tooltip shows value and percentage.',
  },
  {
    title: 'Donut',
    description:
      'Hollow center via the `donut` prop. Use it when a KPI fits in the middle, or when you want a lighter visual weight.',
  },
  {
    title: 'Donut with center label',
    description:
      'Combine `donut` with an option override that paints a label inside the hole — popular for share/percent KPIs.',
  },
  {
    title: 'Rose (Nightingale)',
    description: 'Slice radius scales with value instead of angle. Better than a pie for highly-skewed distributions.',
  },
  {
    title: 'Outside labels',
    description:
      'Slice labels with leader lines. Use when the legend is too far away or when categories have long names.',
  },
  {
    title: 'Carrier capacity',
    description: 'Air cargo freighter share — SQ leads the week on Transpacific lift.',
  },
]
