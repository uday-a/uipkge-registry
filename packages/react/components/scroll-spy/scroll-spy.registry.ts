import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'scroll-spy',
  type: 'registry:ui',
  title: 'ScrollSpy',
  description:
    'In-page navigation list with scroll-spy. Renders a vertical list of links; the active item highlights as the user scrolls through anchored sections.',
  categories: ['navigation'],
  framework: 'react',
  files: [
    { path: 'scroll-spy.tsx', target: 'components/ui/scroll-spy/scroll-spy.tsx' },
    { path: 'index.ts', target: 'components/ui/scroll-spy/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})
