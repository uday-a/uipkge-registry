import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'labeled-value',
  type: 'registry:ui',
  categories: ['data-display'],
  description:
    'Read-only label/value pair for surface details — "Email: jane@…" or "Status: Active". Compose them in a Data List, a Stat Card, or a Section Card detail row.',
  files: [
    { path: 'labeled-value.tsx', target: 'components/ui/labeled-value/labeled-value.tsx' },
    { path: 'index.ts', target: 'components/ui/labeled-value/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})
