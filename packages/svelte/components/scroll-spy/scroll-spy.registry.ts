import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'scroll-spy',
  type: 'registry:ui',
  title: 'ScrollSpy',
  description:
    'In-page navigation list with scroll-spy. Renders a vertical list of links; the active item highlights as the user scrolls through anchored sections.',
  categories: ['navigation'],
  framework: 'svelte',
  files: [
    { path: 'ScrollSpy.svelte', target: 'components/ui/scroll-spy/ScrollSpy.svelte' },
    { path: 'ScrollSpyIndicator.svelte', target: 'components/ui/scroll-spy/ScrollSpyIndicator.svelte' },
    { path: 'ScrollSpyItem.svelte', target: 'components/ui/scroll-spy/ScrollSpyItem.svelte' },
    { path: 'ScrollSpyLink.svelte', target: 'components/ui/scroll-spy/ScrollSpyLink.svelte' },
    { path: 'ScrollSpyList.svelte', target: 'components/ui/scroll-spy/ScrollSpyList.svelte' },
    { path: 'ScrollSpyTitle.svelte', target: 'components/ui/scroll-spy/ScrollSpyTitle.svelte' },
    { path: 'ScrollSpyStepper.svelte', target: 'components/ui/scroll-spy/ScrollSpyStepper.svelte' },
    { path: 'context.ts', target: 'components/ui/scroll-spy/context.ts' },
    { path: 'index.ts', target: 'components/ui/scroll-spy/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})
