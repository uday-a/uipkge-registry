import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  {
    title: 'With forms (settings page)',
    description:
      'Canonical settings-page pattern: left rail with Profile / Security / Notifications, right pane holds the form for the active section. Bind your own state and submit handler.',
  },
  { title: 'Default', description: 'Settings-style left rail with section labels and icon-prefixed items.' },
  { title: 'Without sections', description: 'Drop VerticalTabsSection for a flat list of items.' },
  { title: 'Disabled item', description: 'Set disabled on a trigger to prevent selection.' },
  { title: 'Compact (no icons)', description: 'Drop the leading icon for a tighter list.' },
  {
    title: 'Static indicator',
    description:
      'Pass animated=false on VerticalTabsList to disable the sliding active surface. Active chrome (muted fill + primary rail) paints on the trigger instead.',
  },
]
