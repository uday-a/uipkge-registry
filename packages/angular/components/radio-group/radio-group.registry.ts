import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'radio-group',
  type: 'registry:ui',
  categories: ['form'],
  framework: 'angular',
  description:
    'Single-selection group with Radix RadioGroup semantics: roving focus where arrow keys move and select, Home/End, loop, disabled items skipped. Vertical or horizontal layout, options array, label / hint / error parts, per-item label and hint, and Ant-style RadioButton (outline / solid, three sizes).',
  files: [
    { path: 'radio-group.component.ts', target: 'components/ui/radio-group/radio-group.component.ts' },
    { path: 'index.ts', target: 'components/ui/radio-group/index.ts' },
  ],
  dependencies: ['@angular/forms'],
  registryDependencies: [],
})
