import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'use-theme',
  type: 'registry:hook',
  description:
    'Framework-agnostic useTheme composable (cookie-backed ref, works in plain Vue / Vite / Nuxt) + an optional Nuxt Nitro plugin that inlines the dark-class assignment in <head> for zero-flash SSR. The composable reads/writes the uipkge-theme cookie directly via document.cookie; the plugin is only needed under Nuxt for SSR no-flash.',
  framework: 'vue',
  files: [
    { path: 'useTheme.ts', target: '~/app/composables/useTheme.ts' },
    { path: '00.theme.ts', target: '~/server/plugins/theme.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})
