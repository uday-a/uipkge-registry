import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  {
    title: 'Default',
    description: 'Front face with sample card data. Brand auto-detected from the number prefix.',
  },
  {
    title: 'Flipped',
    description: 'Back face with CVC. The 700ms 3D rotateY transition is springy and smooth.',
  },
  {
    title: 'Brand auto-detect',
    description:
      'Number is typed automatically. Each new digit pops onto the card and the brand wordmark flips in when it changes.',
  },
  {
    title: 'Live typing',
    description:
      'Type a card number to see digits animate in and the logo switch. Focus the CVC field to flip the card to the back.',
  },
  {
    title: 'Click to flip',
    description: 'Toggle the flipped prop — useful for checkout forms that reveal CVC on demand.',
  },
  {
    title: 'Tilt + shimmer',
    description: 'Opt-in tilt follows the mouse via rAF; shimmer runs a 2.5s gradient sweep. Hover over the card.',
  },
  {
    title: 'Empty / placeholder',
    description: 'No number yet — masked bullets and a generic CARD mark until the first digits land.',
  },
  {
    title: 'Compact variant',
    description: 'Used inside lists and confirmation summaries — fixed 120px width, scaled-down typography.',
  },
  {
    title: 'All brands',
    description: 'Force a specific brand via the brand prop. Each gets its own metallic face + wordmark.',
  },
  {
    title: 'Sizes',
    description: 'Three fixed sizes: 280 / 340 / 400px wide.',
  },
]
