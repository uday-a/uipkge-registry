import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'chip',
  type: 'registry:ui',
  categories: ['data-display'],
  framework: 'svelte',
  description:
    'Compact, removable tag — typically used inside `tags-input` or as a filter pill. Seven variants (`default`, `filled`, `outlined`, `elevated`, `success`, `warning`, `destructive`), three sizes, an optional close button with enter/leave micro-animation, and a ChipGroup selection container with single/multiple/mandatory/max modes.',
  files: [
    { path: 'Chip.svelte', target: 'components/ui/chip/Chip.svelte' },
    { path: 'ChipGroup.svelte', target: 'components/ui/chip/ChipGroup.svelte' },
    { path: 'chip.variants.ts', target: 'components/ui/chip/chip.variants.ts' },
    { path: 'index.ts', target: 'components/ui/chip/index.ts' },
  ],
  dependencies: ['class-variance-authority', '@lucide/svelte'],
  registryDependencies: [],
})
