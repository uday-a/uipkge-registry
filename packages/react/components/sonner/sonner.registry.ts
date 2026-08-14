import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'sonner',
  type: 'registry:ui',
  categories: ['feedback'],
  description:
    'Toast notification system — non-blocking, auto-dismissing alerts that stack in a corner. Built on the `sonner` library with the registry’s tokens applied.',
  files: [
    { path: 'Sonner.tsx', target: 'components/ui/sonner/Sonner.tsx' },
    { path: 'index.ts', target: 'components/ui/sonner/index.ts' },
  ],
  dependencies: ['sonner', 'next-themes', 'lucide-react'],
  registryDependencies: [],
})
