import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'color-picker',
  type: 'registry:ui',
  categories: ['form'],
  framework: 'svelte',
  description:
    'Hex color input with a native color trigger, an editable hex field, and a preset swatch grid. Two-way bindable value with an onValueChange callback; presets are overridable or hideable.',
  files: [
    { path: 'ColorPicker.svelte', target: 'components/ui/color-picker/ColorPicker.svelte' },
    { path: 'index.ts', target: 'components/ui/color-picker/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})
