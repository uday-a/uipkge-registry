import type { AngularStory } from './stories'

/** Story cards for the data-table Angular demo (titles + descriptions mirror demos/react/data-table.tsx). */
export const stories: AngularStory[] = [
  {
    title: 'Default — fully featured',
    description: 'Search, sortable columns, and pagination composed from the headless DataTable pipeline.',
  },
  {
    title: 'Sortable columns',
    description: 'Click a column header to sort ascending, then descending. setSort announces via the announcer hook.',
  },
  {
    title: 'No search',
    description: 'Disable the search input and keep sorting plus pagination.',
  },
  {
    title: 'No pagination',
    description: 'Render every filtered row at once — handy for short lists with search.',
  },
  {
    title: 'Sticky header',
    description: 'Wrap Table in a max-height scroller and keep the header sticky so column labels stay visible.',
  },
  {
    title: 'Density: compact',
    description: 'Tighter row padding for log-style or analytics views.',
  },
  {
    title: 'Empty state',
    description: 'When the query returns no rows, a friendly empty state replaces the table.',
  },
]
