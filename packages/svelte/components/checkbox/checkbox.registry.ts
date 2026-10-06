import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'checkbox',
  type: 'registry:ui',
  categories: ['form'],
  framework: 'svelte',
  description:
    'Standalone or in-form binary toggle with Svelte 5 runes (no headless dependency — keyboard, tri-state, and group context are hand-rolled). Supports indeterminate state for tri-state lists, sizes, colors, label/hint/error plumbing, and proper keyboard / screen-reader behavior. CheckboxGroup renders option arrays or manages slotted checkboxes with bind:value.',
  files: [
    { path: 'Checkbox.svelte', target: 'components/ui/checkbox/Checkbox.svelte' },
    { path: 'CheckboxGroup.svelte', target: 'components/ui/checkbox/CheckboxGroup.svelte' },
    { path: 'index.ts', target: 'components/ui/checkbox/index.ts' },
  ],
  dependencies: ['@lucide/svelte'],
  registryDependencies: [],
})
