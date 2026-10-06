import type { AngularStory } from './stories'

/** Story cards for the table Angular demo (titles + descriptions mirror demos/react/table.tsx). */
export const stories: AngularStory[] = [
  {
    title: 'Default',
    description: 'Plain Table with header + body. Use Badge in cells for status pills.',
  },
  {
    title: 'With caption',
    description: 'Add a TableCaption at the bottom for a summary.',
  },
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
    description: 'Use density="compact" for tighter rows. Use it when the table holds many rows in a limited viewport.',
  },
  {
    title: 'Sticky header',
    description: 'Wrap Table in a max-height scroller and keep TableHeader sticky so column labels stay visible.',
  },
  {
    title: 'Empty',
    description: 'Render TableEmpty for an empty ledger. Pair with a short prompt, not a blank tbody.',
  },
]
