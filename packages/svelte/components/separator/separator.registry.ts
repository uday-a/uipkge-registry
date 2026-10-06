import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'separator',
  type: 'registry:ui',
  categories: ['layout'],
  framework: 'svelte',
  description:
    'Horizontal or vertical visual divider — a `<div>` with the right ARIA role and a registry-token border color. Use between sections, list rows, and toolbar groups.',
  files: [
    { path: 'Separator.svelte', target: 'components/ui/separator/Separator.svelte' },
    { path: 'index.ts', target: 'components/ui/separator/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})
