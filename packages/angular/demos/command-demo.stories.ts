import type { AngularStory } from './stories'

/** Story cards for the command Angular demo (titles + descriptions mirror demos/react/command.tsx). */
export const stories: AngularStory[] = [
  { title: 'Default', description: 'Searchable command palette with grouped items and an empty state.' },
  { title: 'With shortcuts', description: 'CommandShortcut renders a right-aligned keyboard hint on each item.' },
  {
    title: 'Multiple groups + separator',
    description: 'Multiple CommandGroup headings divided by a CommandSeparator.',
  },
  { title: 'CommandDialog (modal)', description: 'Press ⌘K (or click the button) to open a modal command palette.' },
  {
    title: 'Loading & empty state',
    description: 'Show a loading skeleton then fall through to CommandEmpty when no items match.',
  },
]
