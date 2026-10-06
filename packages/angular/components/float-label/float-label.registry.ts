import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'float-label',
  type: 'registry:ui',
  categories: ['control', 'form'],
  framework: 'angular',
  description:
    'Floating label wrapper for any input element. The label floats up when the input is focused or has a value. Wrap it around any input, select, or textarea. Supports required indicator and disabled state.',
  files: [
    { path: 'float-label.component.ts', target: 'components/ui/float-label/float-label.component.ts' },
    { path: 'index.ts', target: 'components/ui/float-label/index.ts' },
  ],
  dependencies: [],
  registryDependencies: ['https://uipkge.dev/r/popper.json'],
})
