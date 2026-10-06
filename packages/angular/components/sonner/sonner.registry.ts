import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'sonner',
  type: 'registry:ui',
  categories: ['feedback'],
  framework: 'angular',
  description:
    'Toast notification system — non-blocking, auto-dismissing alerts that stack in a corner. A dependency-free port of `sonner` (same `toast()` API, DOM and stylesheet) with the registry’s tokens applied.',
  files: [
    { path: 'sonner.component.ts', target: 'components/ui/sonner/sonner.component.ts' },
    { path: 'index.ts', target: 'components/ui/sonner/index.ts' },
  ],
  dependencies: [],
  registryDependencies: ['https://uipkge.dev/r/use-theme.json'],
})
