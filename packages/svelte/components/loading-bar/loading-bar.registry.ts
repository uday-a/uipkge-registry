import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'loading-bar',
  type: 'registry:ui',
  categories: ['feedback'],
  framework: 'svelte',
  description:
    'Top-of-viewport NProgress-style progress bar. Drive it imperatively via the createLoadingBar controller (start/finish/error/inc) or with bind:value. Supports indeterminate mode, custom color and height, top/bottom anchoring, and an optional trailing spinner.',
  files: [
    { path: 'LoadingBar.svelte', target: 'components/ui/loading-bar/LoadingBar.svelte' },
    { path: 'useLoadingBar.svelte.ts', target: 'components/ui/loading-bar/useLoadingBar.svelte.ts' },
    { path: 'index.ts', target: 'components/ui/loading-bar/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})
