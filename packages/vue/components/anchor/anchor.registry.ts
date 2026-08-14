import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'anchor',
  type: 'registry:ui',
  categories: ['navigation'],
  framework: 'vue',
  description:
    'In-page navigation list with scroll-spy. Renders a vertical list of links; the active item highlights as the user scrolls through anchored sections.',
  files: [
    { path: 'Anchor.vue', target: 'components/ui/anchor/Anchor.vue' },
    { path: 'AnchorLink.vue', target: 'components/ui/anchor/AnchorLink.vue' },
    { path: 'context.ts', target: 'components/ui/anchor/context.ts' },
    { path: 'index.ts', target: 'components/ui/anchor/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})
