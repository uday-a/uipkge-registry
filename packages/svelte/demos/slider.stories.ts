import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  { title: 'Default (single thumb)', description: 'Number model — the simplest single-thumb slider.' },
  { title: 'Backward-compat array', description: 'Array model preserved for existing consumers.' },
  { title: 'Range', description: 'Dual-thumb range selection with range prop.' },
  { title: 'With step', description: 'step=10 snaps to multiples of 10.' },
  { title: 'Disabled', description: 'Non-interactive state with reduced opacity.' },
  { title: 'Small size', description: 'Compact track and thumb.' },
  { title: 'Reverse', description: 'Right-to-left rendering using reverse prop.' },
  { title: 'Included = false', description: 'Track fill hidden; only thumbs are visible.' },
  { title: 'Dots', description: 'Show dots at every step position.' },
  { title: 'Marks', description: 'Custom labels at specific values.' },
  { title: 'Marks + dots + included', description: 'Combined marks, dots and filled track.' },
  { title: 'Tooltip formatter', description: 'Custom tooltip text via formatter function.' },
  { title: 'No tooltip', description: 'Tooltip hidden with tooltip={false}.' },
  { title: 'Vertical', description: 'Vertical orientation with height prop.' },
  { title: 'Vertical with marks', description: 'Vertical slider + marks + dots.' },
]
