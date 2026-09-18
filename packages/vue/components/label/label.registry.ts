import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'label',
  type: 'registry:ui',
  categories: ['form'],
  framework: 'vue',
  description:
    'Accessible label primitive — wraps text and binds to its child input via `for`. Disabled-state styling, optional required-asterisk, and proper screen-reader behavior.',
  files: [
    { path: 'Label.vue', target: 'components/ui/label/Label.vue' },
    { path: 'index.ts', target: 'components/ui/label/index.ts' },
  ],
  dependencies: ['@vueuse/core', 'reka-ui'],
  registryDependencies: [],
})
