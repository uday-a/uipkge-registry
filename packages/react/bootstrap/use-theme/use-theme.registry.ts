import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'use-theme',
  type: 'registry:hook',
  description:
    'Theme provider + useTheme hook (next-themes). ThemeProvider injects a blocking script that sets the dark class before first paint (no flash on reload); useTheme reads/sets the active theme. The React/Next equivalent of the Vue useTheme composable.',
  files: [
    { path: 'theme-provider.tsx', target: 'components/theme-provider.tsx' },
    { path: 'use-theme.ts', target: 'lib/use-theme.ts' },
  ],
  dependencies: ['next-themes'],
  registryDependencies: [],
})
