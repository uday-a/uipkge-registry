import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  { title: 'Default', description: 'Inline keyboard hint styled with muted surface and mono font.' },
  { title: 'Single key', description: 'One-letter shortcuts for arrow keys and modifiers.' },
  { title: 'Modifier combos', description: 'Group related keys inline — each key is its own chip.' },
  { title: 'In a button row', description: 'Pair with Button for shortcut affordances on toolbars.' },
  { title: 'Long label', description: 'Chips grow with content — no truncation on wider labels.' },
]
