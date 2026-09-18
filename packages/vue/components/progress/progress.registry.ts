import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'progress',
  type: 'registry:ui',
  categories: ['feedback'],
  framework: 'vue',
  description:
    'Linear progress bar — determinate or indeterminate. Two visual densities (slim, default), four tones, and an optional inline percentage label.',
  files: [
    { path: 'Progress.vue', target: 'components/ui/progress/Progress.vue' },
    { path: 'index.ts', target: 'components/ui/progress/index.ts' },
  ],
  dependencies: ['@vueuse/core', 'reka-ui'],
  registryDependencies: [],
})
