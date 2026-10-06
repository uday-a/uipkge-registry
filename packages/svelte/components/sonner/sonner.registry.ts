import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'sonner',
  type: 'registry:ui',
  categories: ['feedback'],
  framework: 'svelte',
  description:
    'Toast notification system — non-blocking, auto-dismissing alerts that stack in a corner. Built on the `svelte-sonner` library with the registry’s tokens applied. Fire toasts with `toast()` from `svelte-sonner`.',
  files: [
    { path: 'Sonner.svelte', target: 'components/ui/sonner/Sonner.svelte' },
    { path: 'index.ts', target: 'components/ui/sonner/index.ts' },
  ],
  dependencies: ['@lucide/svelte', 'svelte-sonner'],
  registryDependencies: [],
})
