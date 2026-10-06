import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  {
    title: 'File picker',
    description: 'Select a single file from a nested project tree — common in editor open-file dialogs.',
  },
  {
    title: 'Multi-select with checkboxes',
    description: 'Pick multiple files at once. Selecting a parent cascades to all leaf descendants.',
  },
  {
    title: 'Size variants',
    description: 'Small, default, and large triggers side by side for comparison.',
  },
  {
    title: 'Loading & disabled states',
    description: 'Spinner while data loads, and a fully disabled control.',
  },
  {
    title: 'Restricted nodes',
    description: 'Individual nodes can be disabled — locked folders and protected files stay non-selectable.',
  },
  {
    title: 'In context: Team permissions',
    description:
      'Assigning teams to a project inside a settings card. Pre-selected teams and multi-select with live count.',
  },
]
