import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'bottom-navigation',
  type: 'registry:ui',
  categories: ['navigation'],
  framework: 'svelte',
  description:
    'Mobile bottom tab bar with icon + label items. Supports bind:value for the active item, an active color, fixed positioning at the viewport bottom, badges on items, and a `to` prop for router integration (via `onnavigate`, e.g. SvelteKit `goto`).',
  files: [
    { path: 'BottomNavigation.svelte', target: 'components/ui/bottom-navigation/BottomNavigation.svelte' },
    { path: 'index.ts', target: 'components/ui/bottom-navigation/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})
