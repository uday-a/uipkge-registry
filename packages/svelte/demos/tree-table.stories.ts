import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  {
    title: 'Project file explorer',
    description: 'A file browser with type icons and a size column — the canonical use case for a tree table.',
  },
  {
    title: 'Department budget breakdown',
    description: 'Hierarchical org data with numeric columns — roll up headcount and budget across nested teams.',
  },
  {
    title: 'Selectable rows',
    description: 'Checkboxes with bind:selected — pick files to bulk-delete or departments to export.',
  },
  {
    title: 'Loading state',
    description: 'A spinner overlay while the tree data is being fetched — keeps the layout stable during the wait.',
  },
  {
    title: 'Custom expand icon',
    description: 'Swap the chevron for a rotated ChevronDown, and tune the indent for denser or looser trees.',
  },
  {
    title: 'Empty state',
    description: 'When the query returns no rows, a friendly empty state replaces the tree.',
  },
]
