import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'skeleton',
  type: 'registry:ui',
  categories: ['feedback'],
  framework: 'svelte',
  description:
    'Animated placeholder rectangles for loading states — drop one in shape of the content that’s about to render. Variants for text lines, avatars, rounded rectangles, and circles.',
  files: [
    { path: 'Skeleton.svelte', target: 'components/ui/skeleton/Skeleton.svelte' },
    { path: 'SkeletonGroup.svelte', target: 'components/ui/skeleton/SkeletonGroup.svelte' },
    { path: 'SkeletonLoader.svelte', target: 'components/ui/skeleton/SkeletonLoader.svelte' },
    { path: 'SkeletonText.svelte', target: 'components/ui/skeleton/SkeletonText.svelte' },
    { path: 'skeleton.variants.ts', target: 'components/ui/skeleton/skeleton.variants.ts' },
    { path: 'index.ts', target: 'components/ui/skeleton/index.ts' },
  ],
  dependencies: ['class-variance-authority'],
  registryDependencies: [],
})
