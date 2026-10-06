import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'progress-linear',
  type: 'registry:ui',
  categories: ['feedback'],
  framework: 'svelte',
  description:
    'Top-of-screen page-loading bar (à la NProgress / nuxt loading-indicator). Auto-advances while a navigation or fetch is in flight, then completes. Drop into the app shell once.',
  files: [
    { path: 'ProgressLinear.svelte', target: 'components/ui/progress-linear/ProgressLinear.svelte' },
    { path: 'progress-linear.variants.ts', target: 'components/ui/progress-linear/progress-linear.variants.ts' },
    { path: 'index.ts', target: 'components/ui/progress-linear/index.ts' },
  ],
  dependencies: ['class-variance-authority'],
  registryDependencies: [],
})
