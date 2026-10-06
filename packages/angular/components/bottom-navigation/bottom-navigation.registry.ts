import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'bottom-navigation',
  type: 'registry:ui',
  categories: ['navigation'],
  framework: 'angular',
  description:
    'Mobile bottom tab bar with icon + label items. Supports v-model for the active item, an active color, fixed positioning at the viewport bottom, badges on items, and a `to` prop for vue-router integration.',
  files: [
    {
      path: 'bottom-navigation.component.ts',
      target: 'components/ui/bottom-navigation/bottom-navigation.component.ts',
    },
    { path: 'index.ts', target: 'components/ui/bottom-navigation/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})
