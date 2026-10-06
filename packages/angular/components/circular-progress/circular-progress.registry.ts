import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'circular-progress',
  type: 'registry:ui',
  categories: ['feedback', 'display'],
  framework: 'angular',
  description:
    'Radial/circular progress indicator. Supports value (0-100), size presets or custom pixel size, stroke thickness, custom arc and track colors, indeterminate spinning mode, a label slot for center content, and a show-value prop that renders the percentage in the center.',
  files: [
    {
      path: 'circular-progress.component.ts',
      target: 'components/ui/circular-progress/circular-progress.component.ts',
    },
    {
      path: 'circular-progress.variants.ts',
      target: 'components/ui/circular-progress/circular-progress.variants.ts',
    },
    { path: 'index.ts', target: 'components/ui/circular-progress/index.ts' },
  ],
  dependencies: ['class-variance-authority'],
  registryDependencies: [],
})
