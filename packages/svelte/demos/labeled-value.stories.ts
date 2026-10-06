import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  { title: 'Default grid', description: 'Label/value pairs in a two-column grid for detail panels.' },
  { title: 'Vertical stack', description: 'Stacked rows for narrow cards and sidebars.' },
  { title: 'Custom value via children', description: 'Render rich content (badges, pills) instead of the value.' },
  { title: 'Truncated long values', description: 'Long values right-align and clip without pushing the label.' },
]
