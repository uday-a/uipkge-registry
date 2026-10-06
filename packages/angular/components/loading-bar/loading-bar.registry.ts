import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'loading-bar',
  type: 'registry:ui',
  categories: ['feedback'],
  framework: 'angular',
  description:
    'Top-of-viewport NProgress-style progress bar. Drive it imperatively via useLoadingBar() or the component methods (start / finish / error / inc / set), or with value / valueChange. Supports indeterminate mode, custom color and height, top/bottom anchoring, and an optional trailing spinner.',
  files: [
    { path: 'loading-bar.component.ts', target: 'components/ui/loading-bar/loading-bar.component.ts' },
    { path: 'index.ts', target: 'components/ui/loading-bar/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})
