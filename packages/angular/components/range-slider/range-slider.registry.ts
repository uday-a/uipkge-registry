import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'range-slider',
  type: 'registry:ui',
  categories: ['form'],
  framework: 'angular',
  description:
    'Two-thumb range slider for "between X and Y" inputs — price filters, age ranges, time windows. Radix Slider semantics (pointer drag, keyboard steps, inverted), with label, hint, ticks, thumb value bubbles, colors, sizes and error state.',
  files: [
    { path: 'range-slider.component.ts', target: 'components/ui/range-slider/range-slider.component.ts' },
    { path: 'index.ts', target: 'components/ui/range-slider/index.ts' },
  ],
  dependencies: ['@angular/forms'],
  registryDependencies: ['https://uipkge.dev/r/popper.json'],
})
