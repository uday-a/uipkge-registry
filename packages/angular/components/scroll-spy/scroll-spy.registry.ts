import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'scroll-spy',
  type: 'registry:ui',
  title: 'ScrollSpy',
  categories: ['navigation'],
  framework: 'angular',
  description:
    'In-page navigation list with scroll-spy. Renders a vertical list of links; the active item highlights as the user scrolls through anchored sections.',
  files: [
    { path: 'scroll-spy.component.ts', target: 'components/ui/scroll-spy/scroll-spy.component.ts' },
    { path: 'scroll-spy.types.ts', target: 'components/ui/scroll-spy/scroll-spy.types.ts' },
    { path: 'index.ts', target: 'components/ui/scroll-spy/index.ts' },
  ],
  dependencies: ['lucide-angular'],
  registryDependencies: [],
})
