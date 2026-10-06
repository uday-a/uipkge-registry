import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'label',
  type: 'registry:ui',
  categories: ['form'],
  framework: 'svelte',
  description:
    'Accessible label primitive — wraps text and binds to its child input via `for`. Disabled-state styling and proper screen-reader behavior.',
  files: [
    { path: 'Label.svelte', target: 'components/ui/label/Label.svelte' },
    { path: 'index.ts', target: 'components/ui/label/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})
