import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'scroll-progress',
  type: 'registry:ui',
  categories: ['feedback', 'utility'],
  framework: 'angular',
  description:
    'Slim reading-progress bar pinned to the top of the viewport or of any supplied scrollable container. Scales horizontally with scroll depth; supports fixed and absolute (contained) modes, lerp smoothing with a prefers-reduced-motion fallback, custom thickness, and any CSS color or gradient.',
  files: [
    { path: 'scroll-progress.component.ts', target: 'components/ui/scroll-progress/scroll-progress.component.ts' },
    { path: 'index.ts', target: 'components/ui/scroll-progress/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})
