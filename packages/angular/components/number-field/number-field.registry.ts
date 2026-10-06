import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'number-field',
  type: 'registry:ui',
  categories: ['form'],
  framework: 'angular',
  description:
    'Numeric input with stepper buttons, min/max bounds, step size, and decimal precision. Use for quantities, prices, and any field that should be a number rather than free text.',
  files: [
    { path: 'number-field.component.ts', target: 'components/ui/number-field/number-field.component.ts' },
    { path: 'index.ts', target: 'components/ui/number-field/index.ts' },
  ],
  dependencies: ['@angular/forms'],
  registryDependencies: [],
})
