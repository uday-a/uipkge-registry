import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'textarea',
  type: 'registry:ui',
  categories: ['form'],
  description:
    'Multi-line text input. Auto-resize variant, character counter, and the same ring/border treatment as the rest of the form primitives.',
  files: [
    { path: 'Textarea.tsx', target: 'components/ui/textarea/Textarea.tsx' },
    { path: 'index.ts', target: 'components/ui/textarea/index.ts' },
  ],
  dependencies: ['lucide-react'],
  registryDependencies: ['https://uipkge.dev/r/label.json'],
})
