import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'mentions',
  type: 'registry:ui',
  categories: ['form'],
  framework: 'svelte',
  description:
    'Textarea with trigger-character autocomplete and companion MentionTag with Twitter/X-style hover profile card popup.',
  files: [
    { path: 'Mentions.svelte', target: 'components/ui/mentions/Mentions.svelte' },
    { path: 'MentionTag.svelte', target: 'components/ui/mentions/MentionTag.svelte' },
    { path: 'caret-position.ts', target: 'components/ui/mentions/caret-position.ts' },
    { path: 'index.ts', target: 'components/ui/mentions/index.ts' },
  ],
  dependencies: ['@lucide/svelte'],
  // Self-contained port: the suggestion listbox and hover card are hand-rolled
  // with runes (no bits-ui / headless float dependency in the Svelte registry
  // yet), so unlike the Vue twin this item pulls no popover/hover-card/avatar.
  registryDependencies: [],
})
