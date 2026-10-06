import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'color-picker',
  type: 'registry:ui',
  categories: ['form'],
  framework: 'angular',
  description:
    'Hex color input: a native color swatch, an optional hex text field and a preset swatch row. Controlled via value / valueChange and usable as a form control.',
  files: [
    { path: 'color-picker.component.ts', target: 'components/ui/color-picker/color-picker.component.ts' },
    { path: 'index.ts', target: 'components/ui/color-picker/index.ts' },
  ],
  dependencies: ['@angular/forms'],
  registryDependencies: [],
})
