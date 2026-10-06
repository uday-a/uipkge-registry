import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'progress',
  type: 'registry:ui',
  categories: ['feedback'],
  framework: 'angular',
  description:
    'Linear progress bar (Radix Progress semantics): role="progressbar" with aria-value* / aria-valuetext, data-state loading | complete, a value clamped to 0–100, and an aria-label fallback when unlabelled.',
  files: [
    { path: 'progress.component.ts', target: 'components/ui/progress/progress.component.ts' },
    { path: 'index.ts', target: 'components/ui/progress/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})
