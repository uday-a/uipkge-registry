import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'icon-transition',
  type: 'registry:ui',
  categories: ['feedback'],
  framework: 'vue',
  description:
    'Animated icon swap for click acknowledgements — copy → check, bookmark → bookmark-filled, follow → follower. Pass two icon components and an async `action`; clicking runs the action then springs the active icon in. Auto-reverts after `resetAfter` ms (default 1500), or pass `0` to keep the active icon and call the exposed `reset()` method to flip it back. Renders as a `<button>` by default; use `as="span"` plus the `:active` prop when you want an externally controlled, non-interactive icon swap inside another control. Honors `prefers-reduced-motion`.',
  files: [
    { path: 'IconTransition.vue', target: 'components/ui/icon-transition/IconTransition.vue' },
    { path: 'index.ts', target: 'components/ui/icon-transition/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})
