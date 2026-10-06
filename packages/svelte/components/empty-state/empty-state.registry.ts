import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'empty-state',
  type: 'registry:ui',
  categories: ['feedback'],
  framework: 'svelte',
  description:
    'Centered placeholder with icon, headline, supporting text, and one or two actions. Drop into empty lists, blank dashboards, and unauthenticated views — the standard "nothing here yet" pattern.',
  files: [
    { path: 'EmptyState.svelte', target: 'components/ui/empty-state/EmptyState.svelte' },
    { path: 'index.ts', target: 'components/ui/empty-state/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})
