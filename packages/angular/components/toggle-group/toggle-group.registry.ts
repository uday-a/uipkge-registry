import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'toggle-group',
  type: 'registry:ui',
  categories: ['action'],
  framework: 'angular',
  description:
    'Group of `Toggle` buttons that act as a single-select or multi-select control (Radix ToggleGroup semantics: roving focus, radio / pressed aria, sliding single-select indicator). Use for view-mode pickers (grid/list), text-format toolbars, and any "pick one of N" button bar.',
  files: [
    { path: 'toggle-group.component.ts', target: 'components/ui/toggle-group/toggle-group.component.ts' },
    { path: 'index.ts', target: 'components/ui/toggle-group/index.ts' },
  ],
  dependencies: [],
  registryDependencies: ['https://uipkge.dev/r/toggle.json'],
})
