import type { AngularStory } from './stories'

/** Story cards for the vertical-tabs Angular demo (titles + descriptions mirror demos/react/vertical-tabs.tsx). */
export const stories: AngularStory[] = [
  {
    title: 'With forms (settings page)',
    description:
      'Canonical settings-page pattern: left rail with Profile / Security / Notifications, right pane holds the form for the active section. Each panel composes Input + Label + Textarea + Switch + Save button. Bind your own v-models and submit handler.',
  },
  {
    title: 'Default',
    description: 'Settings-style left rail with section labels and icon-prefixed items.',
  },
  {
    title: 'Without sections',
    description: 'Drop VerticalTabsSection for a flat list of items.',
  },
  {
    title: 'Disabled item',
    description: 'Set disabled on a trigger to prevent selection.',
  },
  {
    title: 'Compact (no icons)',
    description: 'Drop the leading icon for a tighter list.',
  },
  {
    title: 'Static indicator',
    description:
      'Pass animated={false} on VerticalTabsList to disable the sliding active surface. Active chrome (muted fill + primary rail) paints on the trigger instead.',
  },
]
