import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  { title: 'Default', description: 'Integer count-up from zero on load.' },
  { title: 'Currency', description: 'Formatted with Intl.NumberFormat USD.' },
  {
    title: 'Fast vs slow',
    description: '300ms vs 2400ms side by side — pick a duration that matches the moment.',
  },
  {
    title: 'Live ticker',
    description: 'Value drifts every two seconds; the tween retargets from the displayed value.',
  },
  {
    title: 'KPI delta',
    description: 'Negative renders red with a down arrow, positive green with an up arrow.',
  },
  {
    title: 'Disabled',
    description: 'disabled renders the target instantly — useful above the fold or in print.',
  },
]
