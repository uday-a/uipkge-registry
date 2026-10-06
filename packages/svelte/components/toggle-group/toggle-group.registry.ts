import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'toggle-group',
  type: 'registry:ui',
  categories: ['action'],
  framework: 'svelte',
  description:
    'Group of `Toggle` buttons that act as a single-select or multi-select control. Use for view-mode pickers (grid/list), text-format toolbars, and any "pick one of N" button bar.',
  files: [
    { path: 'ToggleGroup.svelte', target: 'components/ui/toggle-group/ToggleGroup.svelte' },
    { path: 'ToggleGroupItem.svelte', target: 'components/ui/toggle-group/ToggleGroupItem.svelte' },
    { path: 'context.svelte.ts', target: 'components/ui/toggle-group/context.svelte.ts' },
    { path: 'index.ts', target: 'components/ui/toggle-group/index.ts' },
  ],
  dependencies: ['class-variance-authority'],
  registryDependencies: ['https://uipkge.dev/r/toggle.json'],
})
