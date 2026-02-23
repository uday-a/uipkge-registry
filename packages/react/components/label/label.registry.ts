import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'label',
  type: 'registry:ui',
  categories: ['form'],
  description:
    'Accessible label primitive — wraps text and binds to its child input via `htmlFor`. Disabled-state styling and proper screen-reader behavior.',
  files: [
    { path: 'Label.tsx', target: 'components/ui/label/Label.tsx' },
    { path: 'index.ts', target: 'components/ui/label/index.ts' },
  ],
  dependencies: ['@radix-ui/react-label'],
  registryDependencies: [],
})
