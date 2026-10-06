import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  { title: 'Default', description: 'File / Edit / View menus with keyboard shortcut hints.' },
  { title: 'With checkbox items', description: 'Sticky toggles bound with bind:checked.' },
  { title: 'With radio group', description: 'One value across several radio items.' },
  { title: 'With submenu', description: 'Nested flyout opened on hover.' },
  { title: 'Destructive item', description: 'Danger-zone action in red.' },
]
