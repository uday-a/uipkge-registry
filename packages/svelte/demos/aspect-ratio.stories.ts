import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  {
    title: 'Common ratios',
    description: '16:9, 4:3, and 1:1 — the three workhorses for media and avatars.',
  },
  {
    title: 'Portrait',
    description: 'Tall ratios for phone-shaped media: 3:4 and 9:16 (Stories / Reels).',
  },
  {
    title: 'Ultrawide',
    description: 'Very wide ratios for hero banners and cinematic crops.',
  },
  {
    title: 'With image fill',
    description: 'An <img> inside fills the box — combine with object-cover to crop without distortion.',
  },
  {
    title: 'Video placeholder',
    description: 'Reserve cinematic space before the player loads to avoid layout shift.',
  },
]
