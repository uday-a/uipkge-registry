import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'slider',
  type: 'registry:ui',
  categories: ['form'],
  framework: 'angular',
  description:
    'Slider with Radix semantics — single or dual-thumb range, vertical, reverse, step dots, labelled marks and a value tooltip on each thumb. Pointer drag, full keyboard support and a ControlValueAccessor for Angular forms.',
  files: [
    { path: 'slider.component.ts', target: 'components/ui/slider/slider.component.ts' },
    { path: 'index.ts', target: 'components/ui/slider/index.ts' },
  ],
  dependencies: ['@angular/forms'],
  registryDependencies: ['https://uipkge.dev/r/popper.json'],
})
