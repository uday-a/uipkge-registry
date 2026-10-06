import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'theme-switch',
  type: 'registry:ui',
  categories: ['action'],
  framework: 'svelte',
  description:
    'Light / dark / system theme toggle — drop in the header. Seven visual variants: `cards`, `icons`, `icon-only`, `dropdown`, `pill`, `pill-4`, and `switch`. Persists choice to `localStorage` and respects `prefers-color-scheme` for `system`.',
  files: [
    { path: 'ThemeSwitch.svelte', target: 'components/ui/theme-switch/ThemeSwitch.svelte' },
    { path: 'index.ts', target: 'components/ui/theme-switch/index.ts' },
  ],
  dependencies: ['@lucide/svelte'],
  registryDependencies: [],
})
