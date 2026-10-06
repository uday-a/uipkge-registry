import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'progress-linear',
  type: 'registry:ui',
  categories: ['feedback'],
  framework: 'angular',
  description:
    'Thin linear progress bar: determinate value, indeterminate slide, buffer fill, animated stream overlay, striped hatch, reverse (right-to-left), custom color / track color / height and rounded variants.',
  files: [
    { path: 'progress-linear.component.ts', target: 'components/ui/progress-linear/progress-linear.component.ts' },
    { path: 'progress-linear.variants.ts', target: 'components/ui/progress-linear/progress-linear.variants.ts' },
    { path: 'index.ts', target: 'components/ui/progress-linear/index.ts' },
  ],
  dependencies: ['class-variance-authority'],
  registryDependencies: [],
})
