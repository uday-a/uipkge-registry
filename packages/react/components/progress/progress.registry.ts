import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'progress',
  type: 'registry:ui',
  categories: ['feedback'],
  description:
    'Linear progress bar — determinate or indeterminate. Two visual densities (slim, default), four tones, and an optional inline percentage label.',
  files: [
    { path: 'Progress.tsx', target: 'components/ui/progress/Progress.tsx' },
    { path: 'index.ts', target: 'components/ui/progress/index.ts' },
  ],
  dependencies: ['@radix-ui/react-progress'],
  registryDependencies: [],
})
