import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'knob',
  type: 'registry:ui',
  categories: ['form'],
  framework: 'angular',
  description:
    'Circular dial input. Drag, wheel, arrow / page / home / end keys; SVG-rendered with a custom value template. Controlled or uncontrolled, usable as a form control.',
  files: [
    { path: 'knob.component.ts', target: 'components/ui/knob/knob.component.ts' },
    { path: 'index.ts', target: 'components/ui/knob/index.ts' },
  ],
  dependencies: ['@angular/forms'],
  registryDependencies: [],
})
