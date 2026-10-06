import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'float-label',
  type: 'registry:ui',
  categories: ['control', 'form'],
  framework: 'svelte',
  description:
    'Floating label wrapper for any input element. The label floats up when the input is focused or has a value. Wrap it around any input, select, or textarea. Supports required indicator and disabled state.',
  files: [
    { path: 'FloatLabel.svelte', target: 'components/ui/float-label/FloatLabel.svelte' },
    { path: 'index.ts', target: 'components/ui/float-label/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})
