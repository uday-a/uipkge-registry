import type { AngularStory } from './stories'

export const stories: AngularStory[] = [
  {
    title: 'Default',
    description: 'Expandable file tree with continuous Discord-style elbow connectors. Defaults to fully expanded.',
  },
  {
    title: 'Collapsed by default',
    description: 'Set default-expanded to false (the default) to start fully collapsed; click chevrons to drill in.',
  },
  {
    title: 'With checkboxes',
    description: "show-checkboxes adds a 14px checkbox before each row's icon for selection-style trees.",
  },
  {
    title: 'Without icons',
    description: 'show-icons=false drops the leading icon column for a tighter, label-only layout.',
  },
  {
    title: 'Channel-style',
    description: 'Discord-style channel tree with one item pre-selected.',
  },
]
