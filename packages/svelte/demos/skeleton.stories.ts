import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  {
    title: 'Profile placeholder',
    description: 'Hand-composed skeleton row using the base Skeleton primitive.',
  },
  {
    title: 'Card placeholder',
    description: 'Stack of muted blocks for card-sized loading content.',
  },
  {
    title: 'SkeletonText paragraph',
    description: 'SkeletonText paints N lines with first/last line width tweaks for a natural paragraph shape.',
  },
  {
    title: 'SkeletonLoader presets',
    description:
      'SkeletonLoader has 24 variants — bigger compositions like article, card-avatar, and list-item-three-line are pre-baked.',
  },
  {
    title: 'SkeletonLoader atoms',
    description:
      'Single-shape variants — avatar, image, button, badge, chip — for finer-grained placeholders inside hand-composed layouts.',
  },
  {
    title: 'Image placeholders',
    description: 'Three image-shaped variants for thumbnails, hero images, and aspect-locked media.',
  },
]
