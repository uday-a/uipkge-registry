import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  { title: 'Default', description: 'Right-click menu with icon items and select callbacks.' },
  { title: 'Checkbox items', description: 'Toggleable menuitemcheckbox rows with a label.' },
  { title: 'Radio group', description: 'Single-choice assignment menu bound to a value.' },
  { title: 'Submenu', description: 'Nested share menu, separator, and a destructive item.' },
  { title: 'With shortcuts', description: 'Trailing keyboard hints per item.' },
  { title: 'Disabled item', description: 'A disabled row that cannot be selected.' },
]
