import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  {
    title: 'Book catalog',
    description: 'A classic nested catalog document — attributes on book nodes, text leaves for author/title/price.',
  },
  {
    title: 'SOAP fault',
    description: 'Namespaced SOAP envelope with a nested fault detail array — common in integration logs.',
  },
  {
    title: 'App config with comment + CDATA',
    description: 'Comments, self-closing feature flags, and a CDATA logging block — the full node-type mix.',
  },
  { title: 'RSS feed', description: 'Channel + item list — how an RSS/Atom inspector looks with expandDepth 2.' },
  { title: 'SVG markup', description: 'Inline SVG as XML — useful when debugging icons or exported vector markup.' },
  {
    title: 'In a debug card',
    description: 'Embedded in a Card with a status badge — how it looks in a real admin / network panel.',
  },
  {
    title: 'Searchable + copy on click',
    description: 'Filter dims non-matching nodes; click any node to copy its subtree and fire a copy event.',
  },
  {
    title: 'Collapsed vs. expanded',
    description: 'expandDepth 0 shows only the root; expandDepth 2 reveals two levels. Use the toolbar to expand all.',
  },
  {
    title: 'Minimal toolbar',
    description: "Hide search controls or the whole toolbar for a cleaner embed where filtering isn't needed.",
  },
  { title: 'Parse error', description: 'Malformed XML surfaces a clear error state instead of crashing the tree.' },
]
