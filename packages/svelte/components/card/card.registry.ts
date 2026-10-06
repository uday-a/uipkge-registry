import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'card',
  type: 'registry:ui',
  categories: ['layout'],
  framework: 'svelte',
  description:
    'Bordered container with an opinionated header / content / footer layout. Use it as the wrapper around any self-contained block of content — settings panels, dashboard tiles, list cells.',
  files: [
    { path: 'Card.svelte', target: 'components/ui/card/Card.svelte' },
    { path: 'CardAction.svelte', target: 'components/ui/card/CardAction.svelte' },
    { path: 'CardContent.svelte', target: 'components/ui/card/CardContent.svelte' },
    { path: 'CardDescription.svelte', target: 'components/ui/card/CardDescription.svelte' },
    { path: 'CardFooter.svelte', target: 'components/ui/card/CardFooter.svelte' },
    { path: 'CardHeader.svelte', target: 'components/ui/card/CardHeader.svelte' },
    { path: 'CardTitle.svelte', target: 'components/ui/card/CardTitle.svelte' },
    { path: 'card.variants.ts', target: 'components/ui/card/card.variants.ts' },
    { path: 'index.ts', target: 'components/ui/card/index.ts' },
  ],
  dependencies: ['class-variance-authority'],
  registryDependencies: [],
})
