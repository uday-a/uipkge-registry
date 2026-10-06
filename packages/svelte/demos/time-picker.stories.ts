import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  { title: 'Default', description: 'Hours and minutes with 5-minute steps.' },
  { title: 'With Seconds', description: 'Seconds column via the HH:mm:ss format.' },
  { title: '12-Hour Format', description: 'AM/PM selector with 12-hour display.' },
  { title: 'Steps', description: 'Custom minute steps for coarser picking.' },
  { title: 'Presets', description: 'One-click shortcuts above the columns.' },
  { title: 'Range Picker', description: 'Start/end pair in a single popover.' },
  { title: 'Sizes', description: 'Small, middle, and large triggers.' },
  { title: 'Status', description: 'Error and warning ring treatments.' },
]
