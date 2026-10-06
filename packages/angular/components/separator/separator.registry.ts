import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'separator',
  type: 'registry:ui',
  categories: ['layout'],
  framework: 'angular',
  description:
    'Horizontal or vertical visual divider — a `<div>` with the right ARIA role and a registry-token border color. Use between sections, list rows, and toolbar groups.',
  files: [
    { path: 'separator.component.ts', target: 'components/ui/separator/separator.component.ts' },
    { path: 'index.ts', target: 'components/ui/separator/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})
