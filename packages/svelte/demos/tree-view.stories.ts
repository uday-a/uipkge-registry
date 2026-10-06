import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  {
    title: 'Default',
    description: 'Expandable file tree with continuous Discord-style elbow connectors. Defaults to fully expanded.',
  },
  {
    title: 'Collapsed by default',
    description: 'Set defaultExpanded to false (the default) to start fully collapsed; click chevrons to drill in.',
  },
  {
    title: 'With checkboxes',
    description: "showCheckboxes adds a 14px checkbox before each row's icon for selection-style trees.",
  },
  {
    title: 'Without icons',
    description: 'showIcons={false} drops the leading icon column for a tighter, label-only layout.',
  },
  {
    title: 'Channel-style',
    description: 'Discord-style channel tree with one item pre-selected.',
  },
]
