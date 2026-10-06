import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  {
    title: 'Basic radar',
    description: 'Multi-series radar with light fill and circular grid. Two cars compared on five attributes.',
  },
  {
    title: 'Single series',
    description: 'One filled polygon — common for self-assessments, skill matrices, scorecards.',
  },
  {
    title: 'Heavy fill',
    description: 'Bump area opacity and thin the outline to read shape-first instead of outline-first.',
  },
  {
    title: 'Polygon grid',
    description: 'Override the radar shape to polygon for a tactical / hexagonal grid look.',
  },
  {
    title: 'Compact scorecard',
    description:
      'Shorter height + single series — drops into a profile card, candidate slate, or team scorecard tile without overwhelming neighbouring content.',
  },
]
