import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  {
    title: 'Variants',
    description: 'Primary, muted, and custom variants control the background and icon color.',
  },
  { title: 'Shapes', description: 'Rounded square versus circle.' },
  { title: 'Sizes', description: 'Three sizes — sm, md, and lg — adjust padding and icon scale.' },
  {
    title: 'Custom colors',
    description: 'Use the custom variant with class and iconClass to compose any color treatment.',
  },
  {
    title: 'Category tiles',
    description: 'Real-world layout pairing IconBox with labels and counts in a card grid.',
  },
  {
    title: 'Surface Tiles & Tokens',
    description: 'Solid, outline, subtle, and status surface containers with calibrated radius and token hierarchy.',
  },
  {
    title: 'Isometric Icon Stack',
    description: '2.5D layered isometric container for elevated empty states, hero cards, and feature callouts.',
  },
]
