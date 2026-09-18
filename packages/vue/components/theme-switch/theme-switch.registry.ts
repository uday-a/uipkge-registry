import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'theme-switch',
  type: 'registry:ui',
  categories: ['action'],
  framework: 'vue',
  description:
    'Light / dark / system theme toggle — drop in the header. Seven visual variants: `cards`, `icons`, `icon-only`, `dropdown`, `pill`, `pill-4`, and `switch`. Persists choice to `localStorage` and respects `prefers-color-scheme` for `system`.',
  files: [
    { path: 'ThemeSwitch.vue', target: 'components/ui/theme-switch/ThemeSwitch.vue' },
    { path: 'index.ts', target: 'components/ui/theme-switch/index.ts' },
  ],
  dependencies: ['lucide-vue-next'],
  registryDependencies: ['https://uipkge.dev/r/section-card.json', 'https://uipkge.dev/r/dropdown-menu.json'],
})
