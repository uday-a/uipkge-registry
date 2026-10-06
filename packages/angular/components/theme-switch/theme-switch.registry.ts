import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'theme-switch',
  type: 'registry:ui',
  categories: ['action'],
  framework: 'angular',
  description:
    'Light / dark / system theme toggle — drop in the header. Seven visual variants: cards, icons, icon-only, dropdown, pill, pill-4, and switch. Persists to localStorage and respects prefers-color-scheme for system.',
  files: [
    { path: 'theme-switch.component.ts', target: 'components/ui/theme-switch/theme-switch.component.ts' },
    { path: 'index.ts', target: 'components/ui/theme-switch/index.ts' },
  ],
  dependencies: [],
  registryDependencies: ['https://uipkge.dev/r/section-card.json'],
})
