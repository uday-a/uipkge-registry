import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'avatar',
  type: 'registry:ui',
  categories: ['data-display'],
  description:
    'Round or rounded-square user image with a fallback that shows initials or an icon when the image is missing or fails to load. Sizes from xs to 2xl, optional status dot, and a group composition for stacked avatar lists.',
  files: [
    { path: 'avatar.tsx', target: 'components/ui/avatar/avatar.tsx' },
    { path: 'avatar.variants.ts', target: 'components/ui/avatar/avatar.variants.ts' },
    { path: 'index.ts', target: 'components/ui/avatar/index.ts' },
  ],
  dependencies: ['class-variance-authority', '@radix-ui/react-avatar'],
  registryDependencies: [],
})
