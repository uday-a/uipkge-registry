import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'breadcrumb',
  type: 'registry:ui',
  categories: ['navigation'],
  framework: 'svelte',
  description:
    'Hierarchical wayfinding strip that shows a user’s position in a nested page tree. Built from `<BreadcrumbList>` and `<BreadcrumbItem>` primitives so you can drop in custom separators, dropdowns for collapsed parents, and ellipsis for overflow.',
  files: [
    { path: 'Breadcrumb.svelte', target: 'components/ui/breadcrumb/Breadcrumb.svelte' },
    { path: 'BreadcrumbEllipsis.svelte', target: 'components/ui/breadcrumb/BreadcrumbEllipsis.svelte' },
    { path: 'BreadcrumbItem.svelte', target: 'components/ui/breadcrumb/BreadcrumbItem.svelte' },
    { path: 'BreadcrumbLink.svelte', target: 'components/ui/breadcrumb/BreadcrumbLink.svelte' },
    { path: 'BreadcrumbList.svelte', target: 'components/ui/breadcrumb/BreadcrumbList.svelte' },
    { path: 'BreadcrumbPage.svelte', target: 'components/ui/breadcrumb/BreadcrumbPage.svelte' },
    { path: 'BreadcrumbSeparator.svelte', target: 'components/ui/breadcrumb/BreadcrumbSeparator.svelte' },
    { path: 'index.ts', target: 'components/ui/breadcrumb/index.ts' },
  ],
  dependencies: ['@lucide/svelte'],
  registryDependencies: [],
})
