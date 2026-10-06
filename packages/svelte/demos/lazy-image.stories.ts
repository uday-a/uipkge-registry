import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  { title: 'Default', description: 'Lazy image with a skeleton placeholder and fade-in on load.' },
  { title: 'Aspect ratios', description: 'Reserve layout space with wide, square, and portrait ratios.' },
  { title: 'Cover vs contain', description: 'Fill-and-crop versus fit-and-letterbox in a fixed box.' },
  {
    title: 'Error fallback (snippet + URL)',
    description: 'Custom snippet content or a fallback image URL when loading fails.',
  },
  { title: 'Eager', description: 'Above-the-fold images load immediately without the observer.' },
]
