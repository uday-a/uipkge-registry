import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'card',
  type: 'registry:ui',
  categories: ['layout'],
  framework: 'vue',
  description:
    'Bordered container with an opinionated header / content / footer layout. Use it as the wrapper around any self-contained block of content — settings panels, dashboard tiles, list cells.',
  files: [
    { path: 'Card.vue', target: 'components/ui/card/Card.vue' },
    { path: 'CardAction.vue', target: 'components/ui/card/CardAction.vue' },
    { path: 'CardContent.vue', target: 'components/ui/card/CardContent.vue' },
    { path: 'CardDescription.vue', target: 'components/ui/card/CardDescription.vue' },
    { path: 'CardFooter.vue', target: 'components/ui/card/CardFooter.vue' },
    { path: 'CardHeader.vue', target: 'components/ui/card/CardHeader.vue' },
    { path: 'CardTitle.vue', target: 'components/ui/card/CardTitle.vue' },
    { path: 'card.variants.ts', target: 'components/ui/card/card.variants.ts' },
    { path: 'index.ts', target: 'components/ui/card/index.ts' },
  ],
  dependencies: ['class-variance-authority'],
  registryDependencies: [],
})
