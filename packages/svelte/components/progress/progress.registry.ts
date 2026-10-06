import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'progress',
  type: 'registry:ui',
  categories: ['feedback'],
  framework: 'svelte',
  description:
    'Linear progress bar — determinate or indeterminate. Two visual densities (slim, default), four tones, and an optional inline percentage label.',
  files: [
    { path: 'Progress.svelte', target: 'components/ui/progress/Progress.svelte' },
    { path: 'index.ts', target: 'components/ui/progress/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})
