import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'avatar',
  type: 'registry:ui',
  categories: ['data-display'],
  framework: 'svelte',
  description:
    'Round or rounded-square user image with a fallback that shows initials or an icon when the image is missing or fails to load. Sizes from xs to 2xl, optional status dot, and a group composition for stacked avatar lists.',
  files: [
    { path: 'Avatar.svelte', target: 'components/ui/avatar/Avatar.svelte' },
    { path: 'AvatarFallback.svelte', target: 'components/ui/avatar/AvatarFallback.svelte' },
    { path: 'AvatarGroup.svelte', target: 'components/ui/avatar/AvatarGroup.svelte' },
    { path: 'AvatarImage.svelte', target: 'components/ui/avatar/AvatarImage.svelte' },
    { path: 'avatar.variants.ts', target: 'components/ui/avatar/avatar.variants.ts' },
    { path: 'context.svelte.ts', target: 'components/ui/avatar/context.svelte.ts' },
    { path: 'index.ts', target: 'components/ui/avatar/index.ts' },
  ],
  dependencies: ['class-variance-authority'],
  registryDependencies: [],
})
