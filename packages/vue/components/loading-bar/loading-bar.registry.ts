import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'loading-bar',
  type: 'registry:ui',
  categories: ['feedback'],
  framework: 'vue',
  description:
    'Top-of-viewport NProgress-style progress bar. Drive it imperatively via the useLoadingBar composable (start/finish/error/inc) or with v-model. Supports indeterminate mode, custom color and height, top/bottom anchoring, and an optional trailing spinner.',
  files: [
    { path: 'LoadingBar.vue', target: 'components/ui/loading-bar/LoadingBar.vue' },
    { path: 'useLoadingBar.ts', target: 'components/ui/loading-bar/useLoadingBar.ts' },
    { path: 'index.ts', target: 'components/ui/loading-bar/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})
