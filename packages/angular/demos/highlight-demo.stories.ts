import type { AngularStory } from './stories'

/** Story cards for the highlight Angular demo (titles mirror demos/react/highlight.tsx). */
export const stories: AngularStory[] = [
  { title: 'Default', description: 'Highlights all occurrences of a query string.' },
  { title: 'Multiple matches', description: 'Every match is wrapped, not just the first.' },
  { title: 'Case-insensitive (default)', description: 'Matches regardless of letter case.' },
  { title: 'Case-sensitive', description: 'Only exact-case matches are highlighted.' },
  { title: 'Whole-word matching', description: 'Only whole words are highlighted, not substrings.' },
  { title: 'Regex query', description: 'Pass a RegExp to highlight a pattern.' },
  { title: 'Max highlights', description: 'Cap the number of rendered highlights.' },
  { title: 'Custom highlight class', description: 'Override the default highlight styling.' },
  {
    title: 'Live search with match count',
    description: 'Bind the query to an input; onTotalMatchCount gives the total for UX feedback.',
  },
  {
    title: 'List filtering',
    description: 'A common real-world pattern: filter a list and highlight the query in each result.',
  },
  { title: 'No query', description: 'When the query is empty, text renders unchanged.' },
  { title: 'No matches', description: 'When nothing matches, text renders unchanged.' },
  { title: 'Multi-line text', description: 'Highlights work across line breaks.' },
  {
    title: 'Custom tag + class',
    description: 'Use span with a custom background for brand-matched highlighting.',
  },
]
