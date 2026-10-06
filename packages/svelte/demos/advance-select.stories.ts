import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  { title: 'Basic', description: 'Simple single select dropdown.' },
  { title: 'Searchable', description: 'Single select with built-in search filtering.' },
  { title: 'Multiple', description: 'Select multiple items with tag chips.' },
  { title: 'Tags', description: 'Create custom tags not in the predefined list.' },
  { title: 'Grouped', description: 'Options organized by country groups.' },
  { title: 'Disabled options', description: 'Some items are non-selectable.' },
  { title: 'Loading', description: 'Shows a spinner in the trigger while loading.' },
  { title: 'Status: error', description: 'Red border for validation errors.' },
]
