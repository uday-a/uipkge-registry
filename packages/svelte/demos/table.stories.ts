import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  { title: 'Default', description: 'Plain Table with header + body. Use pills in cells for status.' },
  { title: 'With caption', description: 'Add a TableCaption at the bottom for a summary.' },
  {
    title: 'Striped rows',
    description: 'Apply odd:bg-muted/40 to TableRow for zebra striping. Improves row tracking at higher row counts.',
  },
  {
    title: 'With footer / totals row',
    description: 'TableFooter renders below the body — handy for column totals, counts, or summary stats.',
  },
  {
    title: 'Compact density',
    description: 'density="compact" tightens cell padding for many rows in a limited viewport.',
  },
  {
    title: 'Sticky header',
    description: 'Wrap Table in a max-height scroller and keep TableHeader sticky so column labels stay visible.',
  },
  {
    title: 'Empty',
    description: 'A single spanning cell is enough for an empty ledger. Pair with a short prompt, not a blank tbody.',
  },
]
