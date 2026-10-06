import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  {
    title: 'Photo edit before / after',
    description:
      'Drag the slider to compare an original photo with its color-graded version — the classic retouching reveal.',
  },
  {
    title: 'UI redesign',
    description: 'Show stakeholders the old dashboard vs the new layout in one interactive frame.',
  },
  {
    title: 'Controlled slider',
    description: 'bind:value exposes the position (0–100). Pair with a range input for precise control.',
  },
  {
    title: 'Orientation & labels',
    description: 'Vertical divider and hidden captions for minimalist layouts.',
  },
  { title: 'Custom handle', description: 'Replace the move icon via the handle snippet.' },
  { title: 'Disabled', description: 'Frozen divider with a dimmed overlay.' },
]
