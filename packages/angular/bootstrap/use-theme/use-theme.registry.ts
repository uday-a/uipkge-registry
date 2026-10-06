import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'use-theme',
  type: 'registry:lib',
  framework: 'angular',
  description:
    'Theme service + injectTheme(): active theme (light / dark / system), resolved theme and setTheme(). Applies the dark class to <html>, persists to localStorage and follows the OS in system mode. The Angular equivalent of the React useTheme hook and the Vue useTheme composable.',
  files: [{ path: 'use-theme.ts', target: '~/src/lib/use-theme.ts' }],
  dependencies: [],
  registryDependencies: [],
})
