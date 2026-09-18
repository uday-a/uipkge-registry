import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'breadcrumb',
  type: 'registry:ui',
  categories: ['navigation'],
  description:
    'Hierarchical wayfinding strip that shows a user’s position in a nested page tree. Built from `<BreadcrumbList>` and `<BreadcrumbItem>` primitives so you can drop in custom separators, dropdowns for collapsed parents, and ellipsis for overflow.',
  files: [
    { path: 'breadcrumb.tsx', target: 'components/ui/breadcrumb/breadcrumb.tsx' },
    { path: 'index.ts', target: 'components/ui/breadcrumb/index.ts' },
  ],
  dependencies: ['@radix-ui/react-slot', 'lucide-react'],
  registryDependencies: [],
})
