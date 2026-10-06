import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'sidebar',
  type: 'registry:ui',
  categories: ['navigation'],
  framework: 'angular',
  description:
    'Full-height app sidebar — collapsible to icons, with grouping, sub-grouping, and integrated search. The navigation surface for product apps with many sections.',
  files: [
    { path: 'sidebar.component.ts', target: 'components/ui/sidebar/sidebar.component.ts' },
    { path: 'sidebar.variants.ts', target: 'components/ui/sidebar/sidebar.variants.ts' },
    { path: 'sidebar-context.ts', target: 'components/ui/sidebar/sidebar-context.ts' },
    { path: 'index.ts', target: 'components/ui/sidebar/index.ts' },
  ],
  dependencies: ['class-variance-authority'],
  registryDependencies: [
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/popper.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/sheet.json',
    'https://uipkge.dev/r/skeleton.json',
    'https://uipkge.dev/r/tooltip.json',
  ],
})
