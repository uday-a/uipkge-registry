import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'tags-input',
  type: 'registry:ui',
  categories: ['form'],
  framework: 'svelte',
  description:
    'Multi-tag input — type a value, hit Enter, get a Chip. Backspace removes the last tag. Use for email recipient lists, tag sets, and free-form keyword inputs.',
  files: [
    { path: 'TagsInput.svelte', target: 'components/ui/tags-input/TagsInput.svelte' },
    { path: 'TagsInputInput.svelte', target: 'components/ui/tags-input/TagsInputInput.svelte' },
    { path: 'TagsInputItem.svelte', target: 'components/ui/tags-input/TagsInputItem.svelte' },
    { path: 'TagsInputItemDelete.svelte', target: 'components/ui/tags-input/TagsInputItemDelete.svelte' },
    { path: 'TagsInputItemText.svelte', target: 'components/ui/tags-input/TagsInputItemText.svelte' },
    { path: 'context.ts', target: 'components/ui/tags-input/context.ts' },
    { path: 'index.ts', target: 'components/ui/tags-input/index.ts' },
  ],
  dependencies: ['@lucide/svelte'],
  registryDependencies: [],
})
