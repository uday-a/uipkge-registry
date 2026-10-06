import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'checkbox',
  type: 'registry:ui',
  categories: ['form'],
  framework: 'angular',
  description:
    'Standalone or in-form binary toggle with Radix Checkbox semantics (button role=checkbox, Space toggles, Enter ignored). Supports indeterminate state, sizes, colors, label / hint / error parts and a CheckboxGroup driven by an options array. Pair with Label for clickable text.',
  files: [
    { path: 'checkbox.component.ts', target: 'components/ui/checkbox/checkbox.component.ts' },
    { path: 'index.ts', target: 'components/ui/checkbox/index.ts' },
  ],
  dependencies: ['@angular/forms'],
  registryDependencies: ['https://uipkge.dev/r/popper.json'],
})
