import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'avatar',
  type: 'registry:ui',
  categories: ['data-display'],
  framework: 'angular',
  description:
    'User avatar with Radix image loading: the image renders only once it has loaded, the fallback (optionally delayed) shows until then. AvatarGroup overlaps avatars and collapses extras into a +N chip.',
  files: [
    { path: 'avatar.component.ts', target: 'components/ui/avatar/avatar.component.ts' },
    { path: 'avatar.variants.ts', target: 'components/ui/avatar/avatar.variants.ts' },
    { path: 'index.ts', target: 'components/ui/avatar/index.ts' },
  ],
  dependencies: ['class-variance-authority'],
  registryDependencies: [],
})
