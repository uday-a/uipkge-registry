import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'textarea',
  type: 'registry:ui',
  categories: ['form'],
  framework: 'svelte',
  description:
    'Multi-line text input. Auto-resize variant, character counter, and the same ring/border treatment as the rest of the form primitives.',
  files: [
    { path: 'Textarea.svelte', target: 'components/ui/textarea/Textarea.svelte' },
    { path: 'index.ts', target: 'components/ui/textarea/index.ts' },
  ],
  dependencies: ['@lucide/svelte'],
  registryDependencies: [],
})
